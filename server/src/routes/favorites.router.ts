import Router from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import favoritesController from '../controllers/favorites.controller'

const router = Router()

// @route get /api/users/favorites?id= ?price= ?orderByPrice=
// @des Get user's favorites
router.get('/', authMiddleware, favoritesController.getUserFavorites)

// @route POST /api/products/favorite?id=$productId$
// @des Add product to user favorites
router.post('/', authMiddleware, favoritesController.addToFavorite)

// @route DELETE /api/products/favorite?id=$productId$
// @des Remove product from user favorites
router.delete('/', authMiddleware, favoritesController.deleteFromFavorite)

export default router
