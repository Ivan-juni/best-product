import ProductCharacteristics from '../db/models/product-characteristics.model'
import Product from '../db/models/product.model'
import { DeleteType, IProduct, IProductsQuery, resultType, StatisticsType } from './types/products.type'
import { removePhoto } from '../utils/remove-photo.util'
import { sort } from '../utils/order-by.util'
import Favorite from '../db/models/favorite.model'
import ProductHistory from '../db/models/product-history.model'
import { findProducts } from '../utils/find-products.util'
import { replaceSpaces } from '../utils/replace-spaces.util'
import Image from '../db/models/image.module'
import { getCategoryChilds } from '../utils/get-category-childs-ids'
import { getCategoryParents } from '../utils/get-category-parents'
import { formatString } from '../utils/format-string.util'

export default class ProductService {
  static async getProductById(id: number): Promise<Product> {
    return Product.query().findById(id).withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
  }

  static async getProducts(searchCriteria: IProductsQuery): resultType {
    // введенная категория и её дочерние
    const categoryChilds = await getCategoryChilds(searchCriteria)
    // родители введенной категории
    const categoryParents = await getCategoryParents(searchCriteria)

    // пагинация
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    // параметры для сортировки
    const sortParams = sort(searchCriteria, ['price', 'favoriteStars'])
    sortParams.map((param) => {
      param.column = `products.${param.column}`
    })

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
      .orderBy(sortParams)
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
  }

  static async getStatistics(quantity = 5): StatisticsType {
    // 5 most viewed/liked/disliked/added to favorites
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
  }

  static async getPriceDynamics(productId: number): Promise<ProductHistory[]> {
    return ProductHistory.query()
      .select('price', 'name', 'action', 'revision', 'datetime', 'id as productId')
      .where({ id: productId })
      .orderBy('revision', 'asc')
  }

  static async getCharacteristics(productId: number): Promise<Product[]> {
    return Product.query()
      .select('products.id as productId', 'products.name as productName', 'product_characteristics.*')
      .where('products.id', '=', productId)
      .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
  }

  static async getMenuInfo(searchCriteria: IProductsQuery): Promise<{
    purpose: string[]
    connectionType: string[]
    display: string[]
    price: { min: string; max: string }
  }> {
    const info = {
      purpose: [] as Array<string>,
      connectionType: [] as Array<string>,
      display: [] as Array<string>,
      design: [] as Array<string>,
      price: {} as { min: string; max: string },
    }
    // введенная категория и её дочерние
    const categoryChilds = await getCategoryChilds(searchCriteria)

    const priceRange = await Product.query()
      .min('products.price as min')
      .max('products.price as max')
      .where((qb) => {
        if (searchCriteria.category) {
          qb.whereIn('categories.id', categoryChilds.categoryIds.split(','))
        }

        findProducts(qb, searchCriteria)
      })
      .first()
      .innerJoin('product_characteristics', 'product_characteristics.id', 'products.characteristicsId')
      .innerJoin('categories', 'categories.id', 'products.categoryId')

    info.price.min = `${priceRange.min}`
    info.price.max = `${priceRange.max}`

    const knex = ProductCharacteristics.knex()
    const stats = await ProductCharacteristics.query()
      .select(
        knex.raw(`GROUP_CONCAT(DISTINCT purpose ORDER BY purpose ASC SEPARATOR "," ) AS purpose, 
          GROUP_CONCAT(DISTINCT connectionType ORDER BY connectionType ASC SEPARATOR "," ) AS connectionType,
          GROUP_CONCAT(DISTINCT display ORDER BY display ASC SEPARATOR "," ) AS display,
          GROUP_CONCAT(DISTINCT design ORDER BY design ASC SEPARATOR "," ) AS design
        `)
      )
      .first()

    info.purpose = formatString(stats.purpose)
    info.connectionType = formatString(stats.connectionType)
    info.display = formatString(stats.display)
    info.design = formatString(stats.design)

    return info
  }

  static async deleteProduct(productName: string, productId: number, characteristicsId: number): DeleteType {
    const deletedProducts = await Product.query().deleteById(productId)
    await ProductCharacteristics.query().deleteById(characteristicsId)

    // Remove product folder with images from server
    removePhoto('', `products/${replaceSpaces(productName)}`)

    // чтобы при ошибке удаления продукта фото не удалялось
    return deletedProducts
  }

  static async deleteImage(name: string, src: string, imageId: number): DeleteType {
    const deletedImages = await Image.query().deleteById(imageId)
    // Remove product image from server folder
    removePhoto(src, `products/${replaceSpaces(name)}`)

    return deletedImages
  }

  static async addImage(
    productId: number,
    files:
      | Express.Multer.File[]
      | {
          [fieldname: string]: Express.Multer.File[]
        }
  ): Promise<Image[]> {
    let insertedImages: Image[] = []
    let images: Express.Multer.File[]

    const product = await Product.query().findById(productId)

    if (Array.isArray(files)) {
      images = Array.from(files)
    } else {
      images = Array.from(files[0])
    }

    images.forEach(async (image) => {
      const folder = replaceSpaces(product.name)
      const src = `http://localhost:${process.env.PORT}/static/products/${folder}/${image.filename}`

      try {
        const insertedImage = await Image.query().insert({
          productId,
          src,
        })
        insertedImages.push(insertedImage)
      } catch (error) {
        console.log('Error: ', error)
        removePhoto(src, `products/${folder}`)
      }
    })

    return insertedImages
  }

  static async addProduct(product: IProduct): Promise<Product> {
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
    }
  }

  static async updateProduct(productName: string, src: string, productId: number, changingValues: IProduct): Promise<Product> {
    // filtering null values
    Object.keys(changingValues).forEach((key) => {
      if (changingValues[key] === null) {
        delete changingValues[key]
      }
    })

    // достаем значения для продукта и для характеристик отдельно
    const { price, categoryId, name, image, ...characteristics } = changingValues
    // повторно для продукта, так как что-то из выше перечисленного может быть null
    const { purpose, description, design, connectionType, microphone, batteryLiveTime, display, ...productValues } = changingValues

    await ProductCharacteristics.query().patchAndFetchById(productId, characteristics)

    const product = await Product.query()
      .patchAndFetchById(productId, productValues)
      .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')

    if (changingValues.image) {
      // Remove old image
      removePhoto(src, `products/${replaceSpaces(productName)}`)
    }

    return product
  }
}
