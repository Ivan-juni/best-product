import Objection from 'objection'
import ProductCharacteristics from '../db/models/product-characteristics/product-characteristics.model'
import Product from '../db/models/product/product.model'
import { IProduct, IProductsQuery } from '../types/products.type'
import path from 'path'
import fs from 'fs'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery) {
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    const findInRange = (
      qb: Objection.QueryBuilder<Product, Product[]>,
      parametr: string
    ) => {
      const parametrArray = searchCriteria[parametr].split('-')

      if (parametrArray.length > 1 && parametrArray[1]) {
        // Ex: if ?parametr=400-1000
        qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]).andWhere(
          `products.${parametr}`,
          '<=',
          +parametrArray[1]
        )
      } else if (parametrArray.length == 1 && !parametrArray[1]) {
        // Ex: if ?parametr=400
        qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0])
      }
    }

    try {
      const products = await Product.query()
        .select()
        .from('products')
        .where(async (qb) => {
          if (searchCriteria.id) {
            qb.where('products.id', '=', +searchCriteria.id)
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
            findInRange(qb, 'price')
          }

          if (searchCriteria.views) {
            findInRange(qb, 'views')
          }

          if (searchCriteria.likes) {
            findInRange(qb, 'likes')
          }

          if (searchCriteria.dislikes) {
            findInRange(qb, 'dislikes')
          }

          if (searchCriteria.favoriteStars) {
            findInRange(qb, 'favoriteStars')
          }
          // if (searchCriteria.category) {
          // }
        })
        .innerJoin('categories', 'categories.id', 'products.categoryId')
        .page(page, limit)

      return products.results
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
