import Router from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import favoritesController from '../controllers/favorites.controller'

const router = Router()

// @route get /api/users/favorites?id= ?price= ?orderByPrice=
// @des Get user's favorites
router.get('/', authMiddleware, favoritesController.getUserFavorites)

// @route get /api/users/favorites/ids
// @des Get favorite's ids
router.get('/ids', authMiddleware, favoritesController.getUserFavoritesIds)

// @route POST /api/products/favorite?id=$productId$
// @des Add product to user favorites
router.post('/', authMiddleware, favoritesController.addToFavorite)

// @route DELETE /api/products/favorite?id=$productId$
// @des Remove product from user favorites
router.delete('/', authMiddleware, favoritesController.deleteFromFavorite)

// likes, dislikes, views

router.post('/likes', authMiddleware, favoritesController.addLike)
router.delete('/likes', authMiddleware, favoritesController.deleteLike)

router.post('/dislikes', authMiddleware, favoritesController.addDislike)
router.delete('/dislikes', authMiddleware, favoritesController.deleteDislike)

router.post('/views', authMiddleware, favoritesController.addView)

export default router
