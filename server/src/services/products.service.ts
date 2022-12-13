import ProductCharacteristics from '../db/models/product-characteristics.model'
import Product from '../db/models/product.model'
import { DeleteType, IProduct, IProductsQuery, resultType, StatisticsType } from './types/products.type'
import Category from '../db/models/category.model'
import { getCategoryId } from '../utils/get-category-id.util'
import { removePhoto } from '../utils/remove-photo.util'
import { sort } from '../utils/sort-by.util'
import Favorite from '../db/models/favorite.model'
import ProductHistory from '../db/models/product-history.model'
import { findProducts } from '../utils/find-products.util'
import { replaceSpaces } from '../utils/replace-spaces.util'
import Image from '../db/models/image.module'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery): resultType {
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
        const childResult = await knex.raw(`SELECT GROUP_CONCAT( lv SEPARATOR "," ) AS categoryIds FROM (
              SELECT @pv:=(
                  SELECT GROUP_CONCAT( id SEPARATOR "," ) FROM categories WHERE FIND_IN_SET( parent, @pv )
                  ) AS lv FROM categories
                  JOIN
                  (SELECT @pv:=${categoryId}) tmp
              ) a
              WHERE lv IS NOT NULL;`)

        categoryChilds = childResult[0][0]

        // для корректного поиска также добавляем айди введенной категории
        if (categoryChilds.categoryIds === '' || categoryChilds.categoryIds == null) {
          categoryChilds.categoryIds = `${categoryId}`
        } else {
          categoryChilds.categoryIds.concat(`, ${categoryId}`)
        }
      }

      // параметры для сортировки
      const sortParams = sort(searchCriteria, ['price', 'favoriteStars'])

      // запрос в базу
      const products = await Product.query()
        .select(
          'products.id',
          'products.name',
          'products.price',
          'products.image',
          'products.likes',
          'products.dislikes',
          'products.views',
          'products.favoriteStars',
          'products.createdAt',
          'products.updatedAt'
        )
        .from('products')
        .where((qb) => {
          if (searchCriteria.category) {
            // получаем товары из данной категории и дочерних
            qb.whereIn('categories.id', categoryChilds.categoryIds.split(','))
          }
          // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
          findProducts(qb, searchCriteria)
        })
        .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
        .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
        .orderBy(`products.${sortParams.column}`, sortParams.order)
        .page(page, limit)

      // записываем в объект результат
      if (searchCriteria.category) {
        return {
          products: products.results,
          categories: categoryParents,
          total: products.total,
        }
      } else {
        return products
      }
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getStatistics(quantity = 5): StatisticsType {
    // 5 most viewed/liked/disliked/added to favorites
    try {
      const views = await Product.query().select('name', 'views').orderBy('views', 'desc').limit(quantity)

      const likes = await Product.query().select('name', 'likes').orderBy('likes', 'desc').limit(quantity)

      const dislikes = await Product.query().select('name', 'dislikes').orderBy('dislikes', 'desc').limit(quantity)

      const favoriteStars = await Product.query().select('name', 'favoriteStars').orderBy('favoriteStars', 'desc').limit(quantity)

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

  static async getPriceDynamics(productId: number): Promise<ProductHistory[]> {
    try {
      const priceDynamics = await ProductHistory.query()
        .select('price', 'name', 'action', 'revision', 'datetime', 'id as productId')
        .where({ id: productId })
        .orderBy('revision', 'asc')

      return priceDynamics
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getCharacteristics(productId: number): Promise<Product[] | null> {
    try {
      const characteristics = await Product.query()
        .select('products.id as productId', 'products.name as productName', 'product_characteristics.*')
        .where('products.id', '=', productId)
        .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')

      return characteristics
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteProduct(productId: number): DeleteType {
    try {
      const product = await Product.query().findById(productId)

      if (!product) {
        return { message: "Can't find this product" }
      }

      // Remove product folder with images from server
      removePhoto('', `products/${replaceSpaces(product.name)}`)

      const deletedProducts = await Product.query().deleteById(productId)
      await ProductCharacteristics.query().deleteById(product.characteristicsId)
      await Favorite.query().delete().where({ productId })

      return deletedProducts
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteImage(productId: number, imageId: number): DeleteType {
    try {
      const product = await Product.query().findById(productId)

      if (!product) {
        return { message: "Can't find this product" }
      }

      const image = await Image.query().findById(imageId)

      if (!image) {
        return { message: "Can't find this image" }
      }

      // Remove product image from server folder
      removePhoto(image.src, `products/${replaceSpaces(product.name)}`)

      const deletedImages = await Image.query().deleteById(imageId)

      return deletedImages
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addImage(productId: number, fileName: string): Promise<Image | null> {
    try {
      const product = await Product.query().findById(productId)

      const image = `http://localhost:${process.env.PORT}/static/products/${replaceSpaces(product.name)}/${fileName}`

      const insertedImage = await Image.query().insert({
        productId,
        src: image,
      })

      return insertedImage
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addProduct(product: IProduct): Promise<Product | null> {
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
      removePhoto(product.image, `products/${replaceSpaces(product.name)}`)
      return null
    }
  }

  static async updateProduct(productId: number, changingValues: IProduct): Promise<Product | null> {
    try {
      const oldProduct = await Product.query().select().findById(productId)

      if (!oldProduct) {
        throw new Error("Can't find this product")
      }

      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      if (changingValues.image) {
        // Remove old image
        removePhoto(oldProduct.image, `products/${replaceSpaces(oldProduct.name)}`)
      }

      return Product.query().patchAndFetchById(productId, changingValues)
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
