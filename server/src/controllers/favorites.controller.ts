import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import favoritesService from '../services/favorites.service'
import { ReturnType } from './types/return.type'
import Favorite from '../db/models/favorite.model'
import Objection from 'objection'
import Product from '../db/models/product.model'

export default class FavoritesController {
  static async getUserFavorites(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Product>> {
    const { id } = req.user

    const favorites = await favoritesService.getFavorites(+id, req.query)

    if (!favorites) {
      return next(ApiError.badRequest(`Fetching favorites error`))
    }

    return res.json(favorites)
  }

  static async getUserFavoritesIds(req: Request, res: Response, next: NextFunction): ReturnType<Favorite[]> {
    const { id } = req.user

    const ids = await favoritesService.getIds(+id)

    if (!ids) {
      return next(ApiError.badRequest(`Fetching favorites ids error`))
    }

    return res.json(ids)
  }

  static async addToFavorite(req: Request, res: Response, next: NextFunction): ReturnType<Favorite> {
    const { id } = req.user
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    const favorite = await Favorite.query().findOne({ userId: id, productId: +productId })

    if (favorite) {
      return next(ApiError.internal('This product already in on your favorites'))
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

    const favorite = await Favorite.query().findOne({ userId: id, productId: +productId })

    if (!favorite) {
      return next(ApiError.internal("This product isn't on your favorites"))
    }

    const result = await favoritesService.deleteFromFavorite(+id, +productId)

    if (!result) {
      return next(ApiError.badRequest(`Adding to favorites error`))
    } else {
      return res.json({
        message: `Successfully deleted ${result} queries`,
      })
    }
  }

  // likes / dislikes / views

  static async addLike(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    } else {
      const product = await Product.query().findOne({ id: +productId })

      if (!product) {
        return next(ApiError.internal("Can't find this product"))
      }
    }

    const likes = await favoritesService.addLike(+productId)

    if (!likes) {
      return next(ApiError.badRequest(`Adding like error`))
    }

    if (likes === 1) {
      return res.json({ message: 'Like successfully added' })
    } else {
      return res.json({ message: 'Like has not added' })
    }
  }

  static async deleteLike(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    } else {
      const product = await Product.query().findOne({ id: +productId })

      if (!product) {
        return next(ApiError.internal("Can't find this product"))
      }

      if (product.likes === 0) {
        return next(ApiError.internal("Can't decrement like, because it's 0 likes"))
      }
    }

    const likes = await favoritesService.deleteLike(+productId)

    if (!likes) {
      return next(ApiError.badRequest(`Deletion like error`))
    }

    if (likes === 1) {
      return res.json({ message: 'Like successfully deleted' })
    } else {
      return res.json({ message: 'Like has not deleted' })
    }
  }

  static async addDislike(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    } else {
      const product = await Product.query().findOne({ id: +productId })

      if (!product) {
        return next(ApiError.internal("Can't find this product"))
      }

      if (product.dislikes === 0) {
        return next(ApiError.internal("Can't decrement dislike, because it's = 0"))
      }
    }

    const dislikes = await favoritesService.addDislike(+productId)

    if (!dislikes) {
      return next(ApiError.badRequest(`Adding dislike error`))
    }

    if (dislikes === 1) {
      return res.json({ message: 'Dislike successfully added' })
    } else {
      return res.json({ message: 'Dislike has not added' })
    }
  }

  static async deleteDislike(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Please, type product id'))
    } else {
      const product = await Product.query().findOne({ id: +productId })

      if (!product) {
        return next(ApiError.internal("Can't find this product"))
      }
    }

    const dislikes = await favoritesService.deleteDislike(+productId)

    if (!dislikes) {
      return next(ApiError.badRequest(`Deletion dislike error`))
    }

    if (dislikes === 1) {
      return res.json({ message: 'Dislike successfully deleted' })
    } else {
      return res.json({ message: 'Dislike has not deleted' })
    }
  }

  static async addView(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { productId } = req.query

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    } else {
      const product = await Product.query().findOne({ id: +productId })

      if (!product) {
        return next(ApiError.internal("Can't find this product"))
      }
    }

    const views = await favoritesService.addView(+productId)

    if (!views) {
      return next(ApiError.badRequest(`Adding view error`))
    }

    if (views === 1) {
      return res.json({ message: 'View successfully added' })
    } else {
      return res.json({ message: 'View has not added' })
    }
  }
}
