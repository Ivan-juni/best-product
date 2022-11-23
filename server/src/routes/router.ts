import express from 'express'
import authRouter from './auth.router'
import goodsRouter from './products.router'
import usersRouter from './users.router'
const router = express.Router()

router.use('/auth', authRouter)
router.use('/goods', goodsRouter)
router.use('/users', usersRouter)

export default router
