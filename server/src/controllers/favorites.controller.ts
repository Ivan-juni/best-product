import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import favoritesService from '../services/favorites.service'
import { ReturnType } from './types/return.type'
import Favorite from '../db/models/favorite.model'

export default class FavoritesController {
  static async getUserFavorites(req: Request, res: Response, next: NextFunction): ReturnType<Favorite[]> {
    const { id } = req.user

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const favorites = await favoritesService.getFavorites(+id, req.query)

    if (!favorites) {
      return next(ApiError.badRequest(`Fetching favorites error`))
    }

    return res.json(favorites)
  }

  static async addToFavorite(req: Request, res: Response, next: NextFunction): ReturnType<Favorite> {
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

  static async deleteFromFavorite(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
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
}
