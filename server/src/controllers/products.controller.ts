import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import productsService from '../services/products.service'
import commentService from '../services/comments.service'
import favoritesService from '../services/favorites.service'
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

    const favorites = await favoritesService.addToFavorite(+id, +productId)

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

    const result = await favoritesService.deleteFromFavorite(+id, +productId)

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

    const comment = await commentService.addComment(
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

    const result = await commentService.deleteComment(+id, +commentId)

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

    const comments = await commentService.getProductComments(
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
    const image = req.file.filename

    let microphone: boolean | null = null

    if (productInfo.microphone) {
      if (productInfo.microphone === 'true') {
        microphone = true
      } else {
        microphone = false
      }
    }

    if (!productInfo.name) {
      return next(ApiError.internal('Please, add name'))
    }
    if (!image) {
      return next(ApiError.internal('Please, add image'))
    } else {
      productInfo.image = `http://localhost:${process.env.PORT}/static/products/${image}`
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

    const product = await productsService.addProduct({
      price: +productInfo.price || null,
      categoryId: +productInfo.categoryId || null,
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

  static async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response<any, Record<string, any>>> {
    try {
      const { productId } = req.query

      const changingValues: IProductBody = req.body
      const image = req.file.filename

      let microphone: boolean | null = null

      if (!productId) {
        return next(ApiError.badRequest('Please, type the product id'))
      }

      if (changingValues.microphone) {
        if (changingValues.microphone === 'true') {
          changingValues.microphone = true
        } else {
          changingValues.microphone = false
        }
      }

      if (image) {
        changingValues.image = `http://localhost:${process.env.PORT}/static/products/${image}`
      }

      const product = await productsService.updateProduct(+productId, {
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
    } catch (error) {
      console.log(error)
      return res.json({ Error: error.message })
    }
  }
}
