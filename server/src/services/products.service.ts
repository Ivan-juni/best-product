import ProductCharacteristics from '../db/models/product-characteristics/product-characteristics.model'
import Product from '../db/models/product/product.model'
import { IProduct, IProductsQuery } from '../types/products.type'
import path from 'path'
import fs from 'fs'
import Category from '../db/models/category/category.model'
import { findInRange } from '../utils/find-in-range.util'
import { getCategoryId } from '../utils/get-category-id.util'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery) {
    try {
      // введенная категория и её дочерние
      let categoryChilds: { categoryIds: string } = { categoryIds: '' }

      // родители введенной категории
      let categoryParents: Array<{
        id: number
        parent: number
        name: string
      }> = []

      // пагинация
      const limit = +searchCriteria.limit || 5
      const page = +searchCriteria.page || 0

      if (searchCriteria.category) {
        // находим id написанной категории
        const categoryId = await getCategoryId(searchCriteria.category)

        // получаем список категорий родителей
        const knex = Category.knex()
        const parentResult = await knex.raw(`SELECT t2.id,
                t2.parent,
                t2.name
                from (
                  select @r as _id,
                    (select @r := parent from categories where id = _id) AS parent,
                    @l := @l + 1 AS lvl from (select @r := ${categoryId}, @l := 0) vars, categories c
                    where @r <> 0) t1
                    join categories t2
                    on  t1._id = t2.id
                    order by t1.lvl desc`)

        categoryParents = parentResult[0]

        // находим id дочерних категорий
        const childResult =
          await knex.raw(`SELECT GROUP_CONCAT( lv SEPARATOR "," ) AS categoryIds FROM (
              SELECT @pv:=(
                  SELECT GROUP_CONCAT( id SEPARATOR "," ) FROM categories WHERE FIND_IN_SET( parent, @pv )
                  ) AS lv FROM categories
                  JOIN
                  (SELECT @pv:=${categoryId}) tmp
              ) a
              WHERE lv IS NOT NULL;`)

        categoryChilds = childResult[0][0]

        // для корректного поиска также добавляем айди введенной категории
        if (
          categoryChilds.categoryIds === '' ||
          categoryChilds.categoryIds == null
        ) {
          categoryChilds.categoryIds = `${categoryId}`
        } else {
          categoryChilds.categoryIds.concat(`, ${categoryId}`)
        }
      }

      const products = await Product.query()
        .select()
        .from('products')
        .where((qb) => {
          if (searchCriteria.category) {
            // получаем товары из данной категории и дочерних
            qb.whereIn('categories.id', categoryChilds.categoryIds.split(','))
          }

          if (searchCriteria.id) {
            qb.andWhere('products.id', '=', +searchCriteria.id)
          }

          if (searchCriteria.name) {
            qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`)
          }

          if (searchCriteria.purpose) {
            qb.andWhere(
              'products.purpose',
              'like',
              `%${searchCriteria.purpose}%`
            )
          }

          if (searchCriteria.price) {
            findInRange(qb, 'price', searchCriteria)
          }

          if (searchCriteria.views) {
            findInRange(qb, 'views', searchCriteria)
          }

          if (searchCriteria.likes) {
            findInRange(qb, 'likes', searchCriteria)
          }

          if (searchCriteria.dislikes) {
            findInRange(qb, 'dislikes', searchCriteria)
          }

          if (searchCriteria.favoriteStars) {
            findInRange(qb, 'favoriteStars', searchCriteria)
          }
        })
        .innerJoin('categories', 'products.categoryId', 'categories.id')
        .page(page, limit)

      // записываем в объект результат
      if (searchCriteria.category) {
        return {
          products: products.results,
          categories: categoryParents,
          total: products.total,
        }
      } else {
        return { ...products }
      }
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getStatistics(quantity = 5) {
    // 5 most viewed/liked/disliked/added to favorites
    try {
      const views = await Product.query()
        .select('name', 'views')
        .orderBy('views', 'desc')
        .limit(quantity)

      const likes = await Product.query()
        .select('name', 'likes')
        .orderBy('likes', 'desc')
        .limit(quantity)

      const dislikes = await Product.query()
        .select('name', 'dislikes')
        .orderBy('dislikes', 'desc')
        .limit(quantity)

      const favoriteStars = await Product.query()
        .select('name', 'favoriteStars')
        .orderBy('favoriteStars', 'desc')
        .limit(quantity)

      return {
        topViews: views,
        topLikes: likes,
        topDislikes: dislikes,
        topFavoriteStars: favoriteStars,
      }
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getCharacteristics(productId: number) {
    try {
      const characteristics = await Product.query()
        .select(
          'products.id as productId',
          'products.name as productName',
          'product_characteristics.*'
        )
        .where('products.id', '=', productId)
        .innerJoin(
          'product_characteristics',
          'product_characteristics.id',
          'products.characteristicsId'
        )

      return characteristics
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteProduct(
    productId: number
  ): Promise<number | { message: string } | null> {
    try {
      const product = await Product.query().findById(productId)

      if (!product) {
        return { message: "Can't find this products" }
      }

      const deletedProducts = await Product.query().deleteById(productId)
      await ProductCharacteristics.query().deleteById(product.characteristicsId)

      return deletedProducts
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addProduct(product: IProduct) {
    try {
      const characteristics = await ProductCharacteristics.query().insert({
        purpose: product.purpose,
        description: product.description,
        design: product.design,
        connectionType: product.connectionType,
        microphone: product.microphone,
        batteryLiveTime: product.batteryLiveTime,
        display: product.display,
      })

      return Product.query().insert({
        name: product.name,
        price: +product.price,
        image: product.image,
        categoryId: +product.categoryId,
        characteristicsId: +characteristics.id,
      })
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async updateProduct(
    productId: number,
    changingValues: IProduct
  ): Promise<Product | { message: string } | null> {
    try {
      const oldProduct = await Product.query().select().findById(productId)

      if (!oldProduct) {
        return { message: "Can't find this product" }
      }
      // Remove old photo
      if (oldProduct.image) {
        const oldPath = path.join(
          __dirname,
          '..',
          '..',
          'assets',
          'products',
          path.basename(oldProduct.image)
        )

        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err) => {
            if (err) {
              console.error(err)
              return
            }
          })
        }
      }

      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      return Product.query().patchAndFetchById(productId, changingValues)
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
