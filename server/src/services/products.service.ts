import ProductCharacteristics from '../db/models/product-characteristics.model'
import Product from '../db/models/product.model'
import { DeleteType, IProduct, IProductsQuery, resultType, StatisticsType } from './types/products.type'
import { removePhoto } from '../utils/remove-photo.util'
import { sort } from '../utils/sort-by.util'
import Favorite from '../db/models/favorite.model'
import ProductHistory from '../db/models/product-history.model'
import { findProducts } from '../utils/find-products.util'
import { replaceSpaces } from '../utils/replace-spaces.util'
import Image from '../db/models/image.module'
import { getCategoryChilds } from '../utils/get-category-childs-ids'
import { getCategoryParents } from '../utils/get-category-parents'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery): resultType {
    try {
      // введенная категория и её дочерние
      const categoryChilds = await getCategoryChilds(searchCriteria)
      // родители введенной категории
      const categoryParents = await getCategoryParents(searchCriteria)

      // пагинация
      const limit = +searchCriteria.limit || 5
      const page = +searchCriteria.page || 0

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
        .innerJoin('categories', 'categories.id', 'products.categoryId')
        .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
        .orderBy(`products.${sortParams.column}`, sortParams.order)
        .page(page, limit)

      // записываем в объект результат
      if (searchCriteria.category) {
        return {
          results: products.results,
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
      const views = await Product.query().select('id', 'name', 'views').orderBy('views', 'desc').limit(quantity)

      const likes = await Product.query().select('id', 'name', 'likes').orderBy('likes', 'desc').limit(quantity)

      const dislikes = await Product.query().select('id', 'name', 'dislikes').orderBy('dislikes', 'desc').limit(quantity)

      const favoriteStars = await Product.query().select('id', 'name', 'favoriteStars').orderBy('favoriteStars', 'desc').limit(quantity)

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

  static async getPriceDynamics(productId: number): Promise<ProductHistory[] | null> {
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

  static async getMenuInfo(searchCriteria: IProductsQuery): Promise<{
    purpose: string[]
    connectionType: string[]
    display: string[]
    price: string[]
  } | null> {
    try {
      const info = {
        purpose: [] as Array<string>,
        connectionType: [] as Array<string>,
        display: [] as Array<string>,
        design: [] as Array<string>,
        price: [] as Array<string>,
      }
      // введенная категория и её дочерние
      const categoryChilds = await getCategoryChilds(searchCriteria)

      const priceMin = await Product.query()
        .min('products.price as price')
        .where((qb) => {
          if (searchCriteria.category) {
            // получаем товары из данной категории и дочерних
            qb.whereIn('categories.id', categoryChilds.categoryIds.split(','))
          }
          // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
          findProducts(qb, searchCriteria)
        })
        .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
        .innerJoin('categories', 'categories.id', 'products.categoryId')

      const priceMax = await Product.query()
        .max('products.price as price')
        .where((qb) => {
          if (searchCriteria.category) {
            // получаем товары из данной категории и дочерних
            qb.whereIn('categories.id', categoryChilds.categoryIds.split(','))
          }
          // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
          findProducts(qb, searchCriteria)
        })
        .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
        .innerJoin('categories', 'categories.id', 'products.categoryId')

      info.price[0] = `${priceMin[0].price}`
      info.price[1] = `${priceMax[0].price}`

      const knex = ProductCharacteristics.knex()
      const _purpose = await knex.raw(
        'SELECT GROUP_CONCAT(DISTINCT purpose ORDER BY purpose ASC SEPARATOR "," ) AS purpose FROM product_characteristics'
      )
      const _connectionType = await knex.raw(
        'SELECT GROUP_CONCAT(DISTINCT connectionType ORDER BY connectionType ASC SEPARATOR "," ) AS connectionType FROM product_characteristics'
      )
      const _display = await knex.raw(
        'SELECT GROUP_CONCAT(DISTINCT display ORDER BY display ASC SEPARATOR "," ) AS display FROM product_characteristics'
      )
      const _design = await knex.raw('SELECT GROUP_CONCAT(DISTINCT design ORDER BY design ASC SEPARATOR "," ) AS design FROM product_characteristics')

      // удаляем пробелы в начале строки, делаем первую букву большой
      const format = (s: string) => {
        while (s.charAt(0) === ' ') {
          return s.substring(1).charAt(0).toLocaleUpperCase() + s.slice(2)
        }
        return s.charAt(0).toLocaleUpperCase() + s.slice(1)
      }

      info.purpose = _purpose[0][0].purpose
        .split(',')
        .map((s: string) => format(s))
        .filter((s: string) => s !== 'null' && s !== 'Null')
      info.connectionType = _connectionType[0][0].connectionType
        .split(',')
        .map((s: string) => format(s))
        .filter((s: string) => s !== 'null' && s !== 'Null')
      info.display = _display[0][0].display
        .split(',')
        .map((s: string) => format(s))
        .filter((s: string) => s !== 'null' && s !== 'Null')
      info.design = _design[0][0].design
        .split(',')
        .map((s: string) => format(s))
        .filter((s: string) => s !== 'null' && s !== 'Null')

      return info
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

  static async addImage(
    productId: number,
    files:
      | Express.Multer.File[]
      | {
          [fieldname: string]: Express.Multer.File[]
        }
  ): Promise<Image[] | null> {
    try {
      let insertedImages: Image[] = []
      let images: Express.Multer.File[]

      const product = await Product.query().findById(productId)

      if (Array.isArray(files)) {
        images = Array.from(files)
      } else {
        images = Array.from(files[0])
      }

      images.forEach(async (image) => {
        const src = `http://localhost:${process.env.PORT}/static/products/${replaceSpaces(product.name)}/${image.filename}`
        const insertedImage = await Image.query().insert({
          productId,
          src,
        })
        insertedImages.push(insertedImage)
      })

      return insertedImages
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addProduct(product: IProduct): Promise<Product | null> {
    try {
      const candidate = await Product.query().select('name').where({ name: product.name })

      if (candidate) {
        throw new Error(`Name should be unique, (${candidate[0].name} already exists)`)
      }

      const characteristics = await ProductCharacteristics.query().insert({
        purpose: product.purpose,
        description: product.description,
        design: product.design,
        connectionType: product.connectionType,
        microphone: product.microphone,
        batteryLiveTime: product.batteryLiveTime,
        display: product.display,
      })

      return Product.query()
        .insert({
          name: product.name,
          price: +product.price,
          image: product.image,
          categoryId: +product.categoryId,
          characteristicsId: +characteristics.id,
        })
        .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
    } catch (error) {
      console.log('Error: ', error)
      removePhoto(product.image, `products/${replaceSpaces(product.name)}`)
      return null
    }
  }

  static async updateProduct(productId: number, changingValues: IProduct): Promise<Product> {
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

      // достаем значения для продукта и для характеристик отдельно
      const { price, categoryId, name, image, ...characteristics } = changingValues
      // повторно для продукта, так как что-то из выше перечисленного может быть null
      const { purpose, description, design, connectionType, microphone, batteryLiveTime, display, ...productValues } = changingValues

      await ProductCharacteristics.query().patchAndFetchById(productId, characteristics)

      const product = await Product.query()
        .patchAndFetchById(productId, productValues)
        .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')

      return product
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
