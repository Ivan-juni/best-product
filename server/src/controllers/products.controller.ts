import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import productsService from '../services/products.service'
import { IProductBody } from '../types/products.type'

export default class ProductsController {
  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const products = await productsService.getProducts(req.query)

    if (!products) {
      return next(ApiError.badRequest(`Fetching products error`))
    }

    return res.json(products)
  }

  static async getStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const quantity = +req.query.quantity || 5

    const products = await productsService.getStatistics(quantity)

    if (!products) {
      return next(ApiError.badRequest(`Fetching products error`))
    }

    return res.json(products)
  }

  static async getCharacteristics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { productId } = req.query

    const characteristics = await productsService.getCharacteristics(+productId)

    if (!characteristics) {
      return next(ApiError.badRequest(`Fetching characteristics error`))
    }

    return res.json(characteristics)
  }

  static async addToFavorite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { id } = req.user
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const favorites = await productsService.addToFavorite(+id, +productId)

    if (!favorites) {
      return next(ApiError.badRequest(`Adding to favorites error`))
    }

    return res.json(favorites)
  }

  static async deleteFromFavorite(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { id } = req.user
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const result = await productsService.deleteFromFavorite(+id, +productId)

    if (!result) {
      return next(ApiError.badRequest(`Adding to favorites error`))
    }

    if (typeof result == 'number') {
      return res.json({
        message: `Successfully deleted ${result} queries`,
      })
    } else {
      return res.json(result)
    }
  }

  static async addComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { id } = req.user
    const { productId } = req.query
    const commentText: string = req.body.text

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    if (!commentText) {
      return next(ApiError.internal('Please, type the cooment text'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const comment = await productsService.addComment(
      +id,
      +productId,
      commentText
    )

    if (!comment) {
      return next(ApiError.badRequest(`Adding comment error`))
    }

    return res.json(comment)
  }

  static async deleteComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { id } = req.user
    const { commentId } = req.query

    if (!commentId) {
      return next(ApiError.internal('Type comment id'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const result = await productsService.deleteComment(+id, +commentId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion comment error`))
    }

    if (typeof result == 'number') {
      return res.json({ message: `Successfully deleted ${result} comments` })
    } else {
      return res.json(result)
    }
  }

  static async getProductComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { productId } = req.query
    const page = +req.query.page || 0
    const limit = +req.query.page || 5

    if (!productId) {
      return next(ApiError.internal('Type the product id'))
    }

    const comments = await productsService.getProductComments(
      +productId,
      page,
      limit
    )

    if (!comments) {
      return next(ApiError.badRequest(`Fetching comments error`))
    }

    return res.json(comments)
  }

  static async deleteProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    const result = await productsService.deleteProduct(+productId)

    if (!result) {
      return next(ApiError.badRequest(`Deletion products error`))
    }

    if (typeof result == 'number') {
      return res.json({ message: `Successfully deleted ${result} products` })
    } else {
      return res.json(result)
    }
  }

  static async addProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    const productInfo: IProductBody = req.body
    let microphone: boolean | null = null
    let batteryLiveTime: number | null = null
    let image = req.file.filename

    if (!productInfo.name) {
      return next(ApiError.internal('Please, add name'))
    }
    if (!image) {
      return next(ApiError.internal('Please, add image'))
    } else {
      image = `http://localhost:${process.env.PORT}/static/products/${image}`
      productInfo.image = image
    }
    if (!productInfo.price) {
      return next(ApiError.internal('Please, add price'))
    }
    if (!productInfo.categoryId) {
      return next(ApiError.internal('Please, add category id'))
    }
    if (!productInfo.purpose) {
      return next(ApiError.internal('Please, add purpose'))
    }
    if (!productInfo.description) {
      return next(ApiError.internal('Please, add description'))
    }

    if (productInfo.batteryLiveTime) {
      batteryLiveTime = Number(productInfo.batteryLiveTime)
    }

    if (productInfo.microphone) {
      if (productInfo.microphone === 'true') {
        microphone = true
      } else {
        microphone = false
      }
    }

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
      batteryLiveTime: batteryLiveTime,
      display: productInfo.display,
    })

    if (!product) {
      return next(ApiError.badRequest(`Adding product error`))
    }

    return res.json(product)
  }
}
