import Router from 'express'
import authController from '../controllers/auth.controller'
import checkAuth from '../middlewares/auth.middleware'

const router = Router()

router.post('/registration', authController.registration)

router.post('/login', authController.login)

router.post('/logout', checkAuth, authController.logout)

router.get('/refresh', authController.refresh)

export default router
