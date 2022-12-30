import express from 'express'
import { createAuthRoutes } from './auth.router'
import { createProductsRoutes } from './products.router'
import { createUsersRoutes } from './users.router'
import { createFavoritesRoutes } from './favorites.router'
import { createCommentsRoutes } from './comments.router'
import { createCategoriesRoutes } from './categories.router'

const router = express.Router()

router.use('/auth', createAuthRoutes())
router.use('/products', createProductsRoutes())
router.use('/users', createUsersRoutes())
router.use('/favorites', createFavoritesRoutes())
router.use('/comments', createCommentsRoutes())
router.use('/categories', createCategoriesRoutes())

export default router
