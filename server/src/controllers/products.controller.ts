import { Request, Response, NextFunction } from 'express'
import * as yup from 'yup'
import ApiError from '../errors/ApiError'
import productsService from '../services/products.service'
import { IProductBody, resultType, StatisticsType } from '../services/types/products.type'
import { ReturnType } from './types/return.type'
import Product from '../db/models/product.model'
import ProductHistory from '../db/models/product-history.model'
import { replaceSpaces } from '../utils/replace-spaces.util'
import Image from '../db/models/image.module'
import { addProductSchema, updateProductSchema } from './types/schemas'

export default class ProductsController {
  static async getProductById(req: Request, res: Response, next: NextFunction): ReturnType<Product> {
    const { id } = req.params

    // if (!id) {
    //   return next(ApiError.internal('Please, type the product id'))
    // }

    const products = await productsService.getProductById(+id)

    if (!products) {
      return next(ApiError.badRequest(`Fetching product error`))
    }

    return res.json(products)
  }

  static async getProducts(req: Request, res: Response, next: NextFunction): ReturnType<resultType> {
    const products = await productsService.getProducts(req.query)

    if (!products) {
      return next(ApiError.badRequest(`Fetching products error`))
    }

    return res.json(products)
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction): ReturnType<StatisticsType> {
    const quantity = +req.query.quantity || 5

    const products = await productsService.getStatistics(quantity)

    if (!products) {
      return next(ApiError.badRequest(`Fetching products error`))
    }

    return res.json(products)
  }

  static async getPriceDynamics(req: Request, res: Response, next: NextFunction): ReturnType<ProductHistory[]> {
    const { productId } = req.query

    if (!productId || isNaN(+productId)) {
      return next(ApiError.badRequest(`Please, type the product id`))
    }

    const priceDynamics = await productsService.getPriceDynamics(+productId)

    if (!priceDynamics) {
      return next(ApiError.badRequest(`Fetching price dynamics error`))
    }

    return res.json(priceDynamics)
  }

  static async getCharacteristics(req: Request, res: Response, next: NextFunction): ReturnType<Product[]> {
    const { productId } = req.query

    const characteristics = await productsService.getCharacteristics(+productId)

    if (!characteristics) {
      return next(ApiError.badRequest(`Fetching characteristics error`))
    }

    return res.json(characteristics)
  }

  static async getDropdownMenuInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): ReturnType<{
    purpose: string[]
    connectionType: string[]
    display: string[]
    design: string[]
    price: string[]
  }> {
    const info = await productsService.getMenuInfo(req.query)

    if (!info) {
      return next(ApiError.badRequest(`Fetching info error`))
    }

    return res.json(info)
  }

  // products admin panel

  static async deleteProduct(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    const product = await Product.query().findById(+productId)

    if (!product) {
      return next(ApiError.internal("Can't find this product"))
    }

    const result = await productsService.deleteProduct(product.name, +productId, product.characteristicsId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion products error`))
    } else {
      return res.json({ message: `Successfully deleted product (id=${productId})` })
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId, imageId } = req.query

    if (!productId) {
      return next(ApiError.internal('Please, type the product id'))
    }

    const product = await Product.query().findById(+productId)

    if (!product) {
      return next(ApiError.internal("Can't find this product"))
    }

    if (!imageId) {
      return next(ApiError.internal('Please, type the image id'))
    }

    const image = await Image.query().findById(+imageId)

    if (!image) {
      return next(ApiError.internal("Can't find this image"))
    }

    const result = await productsService.deleteImage(product.name, image.src, +imageId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion images error`))
    } else {
      return res.json({ message: `Successfully deleted image (id=${imageId})` })
    }
  }

  static async addProduct(req: Request, res: Response, next: NextFunction): ReturnType<Product> {
    const productInfo: IProductBody = req.body
    const image = req.file !== undefined ? req.file.filename : null
    let microphone: boolean = false

    await addProductSchema.validate({ ...productInfo, image })

    const candidate = await Product.query().select('name').where({ name: productInfo.name }).first()

    if (candidate) {
      next(ApiError.internal(`Name should be unique, (${candidate.name} already exists)`))
    }

    if (productInfo.microphone) {
      if (productInfo.microphone === 'true') {
        microphone = true
      } else {
        microphone = false
      }
    }

    productInfo.image = `http://localhost:${process.env.PORT}/static/products/${replaceSpaces(productInfo.name)}/${image}`

    const product = await productsService.addProduct({
      price: +productInfo.price,
      categoryId: +productInfo.categoryId,
      name: productInfo.name,
      image: productInfo.image,
      purpose: productInfo.purpose,
      description: productInfo.description,
      design: productInfo.design,
      connectionType: productInfo.connectionType,
      microphone: microphone,
      batteryLiveTime: +productInfo.batteryLiveTime || null,
      display: productInfo.display,
    })

    if (!product) {
      return next(ApiError.badRequest(`Adding product error`))
    }

    return res.json(product)
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): ReturnType<Product> {
    const { productId } = req.query
    const changingValues: IProductBody = req.body
    const image = req.file !== undefined ? req.file.filename : null

    let microphone: boolean | null = null

    if (changingValues.name) {
      const candidate = await Product.query().select('name').where({ name: changingValues.name }).first()

      if (candidate) {
        next(ApiError.internal(`Name should be unique, (${candidate.name} already exists)`))
      }
    }

    await updateProductSchema.validate({ ...changingValues, image })

    if (!productId) {
      return next(ApiError.badRequest('Please, type the product id'))
    }

    const oldProduct = await Product.query().select().findById(+productId)

    if (!oldProduct) {
      throw new Error("Can't find this product")
    }

    if (changingValues.microphone) {
      if (changingValues.microphone === 'true') {
        microphone = true
      } else {
        microphone = false
      }
    }

    if (image) {
      const product = await Product.query().select('products.name').from('products').where('products.id', '=', `${productId}`).first()

      changingValues.image = `http://localhost:${process.env.PORT}/static/products/${replaceSpaces(product.name)}/${image}`
    }

    const product = await productsService.updateProduct(oldProduct.name, oldProduct.image, +productId, {
      price: +changingValues.price || null,
      categoryId: +changingValues.categoryId || null,
      name: changingValues.name,
      image: changingValues.image,
      purpose: changingValues.purpose,
      description: changingValues.description,
      design: changingValues.design,
      connectionType: changingValues.connectionType,
      microphone: microphone,
      batteryLiveTime: +changingValues.batteryLiveTime || null,
      display: changingValues.display,
    })

    if (!product) {
      return next(ApiError.badRequest(`Updating product error`))
    }

    return res.json(product)
  }

  static async addImage(req: Request, res: Response, next: NextFunction): ReturnType<Image[]> {
    const { productId } = req.query
    const files = req.files !== undefined ? req.files : null

    if (!productId) {
      return next(ApiError.internal('Please, type product id'))
    }
    if (!files || files == undefined) {
      return next(ApiError.internal('Please, add image'))
    }

    const insertedImages = await productsService.addImage(+productId, files)

    if (!insertedImages) {
      return next(ApiError.badRequest(`Adding image error`))
    }

    return res.json(insertedImages)
  }
}
