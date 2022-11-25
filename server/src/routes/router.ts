import express from 'express'
import authRouter from './auth.router'
import productsRouter from './products.router'
import usersRouter from './users.router'
const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productsRouter)
router.use('/users', usersRouter)

export default router
