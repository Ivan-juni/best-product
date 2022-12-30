import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'
import favoritesController from '../controllers/favorites.controller'

export function createFavoritesRoutes(): Router {
  const router = Router()

  router.use(authMiddleware)

  router.get('/', asyncHandler(favoritesController.getUserFavorites))

  // Get favorite's ids
  router.get('/ids', asyncHandler(favoritesController.getUserFavoritesIds))

  router.post('/', asyncHandler(favoritesController.addToFavorite))

  // ?id=$productId$
  router.delete('/', asyncHandler(favoritesController.deleteFromFavorite))

  // likes, dislikes, views
  router.post('/likes', asyncHandler(favoritesController.addLike))
  router.delete('/likes', asyncHandler(favoritesController.deleteLike))

  router.post('/dislikes', asyncHandler(favoritesController.addDislike))
  router.delete('/dislikes', asyncHandler(favoritesController.deleteDislike))

  router.post('/views', asyncHandler(favoritesController.addView))

  return router
}
