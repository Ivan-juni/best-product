import { Router } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import asyncHandler from '../middlewares/async-handler.middleware'
import commentsController from '../controllers/comments.controller'

export function createCommentsRoutes(): Router {
  const router = Router()

  // ?productId=
  router.get('/', asyncHandler(commentsController.getProductComments))

  router.use(authMiddleware)

  router.get('/user', asyncHandler(commentsController.getUserComments))

  // ?productId=
  router.post('/', asyncHandler(commentsController.addComment))

  // ?commentId=
  router.patch('/', asyncHandler(commentsController.updateComment))

  // ?commentId=
  router.delete('/', asyncHandler(commentsController.deleteComment))

  return router
}
