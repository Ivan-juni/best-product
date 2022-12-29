import Router from 'express'
import authController from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'

const router = Router()

router.post('/registration', asyncHandler(authController.registration))

router.post('/login', asyncHandler(authController.login))

router.get('/refresh', asyncHandler(authController.refresh))

router.use(authMiddleware)
router.post('/logout', asyncHandler(authController.logout))

export default router
