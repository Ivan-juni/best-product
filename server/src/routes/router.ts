import express from 'express'
import authRouter from './auth.router'
import productsRouter from './products.router'
import usersRouter from './users.router'
import favoritesRouter from './favorites.router'
import commentsRouter from './comments.router'
import categoriesRouter from './categories.router'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/users', usersRouter)
router.use('/favorites', favoritesRouter)
router.use('/comments', commentsRouter)
router.use('/categories', categoriesRouter)

export default router
