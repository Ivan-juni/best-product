import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import productsService from '../services/products.service'

export default class ProductsController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    const products = await productsService.getProducts(req.query)

    if (!products) {
      return next(ApiError.badRequest(`Fetching products error`))
    }

    return res.json(products)
  }
}
