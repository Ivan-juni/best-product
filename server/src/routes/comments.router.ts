import express from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import commentsController from '../controllers/comments.controller'

const router = express.Router()

// @route get /api/comments/user
// @des Get user's comments
router.get('/user', authMiddleware, commentsController.getUserComments)

// @route GET /api/comments/:productId
// @des Get product comments
router.get('/:productId', commentsController.getProductComments)

// @route POST /api/comments/:productId
// @des Add comment to product
router.post('/', authMiddleware, commentsController.addComment)

// @route DELETE /api/comments/:commentId
// @des Delete comment
router.delete('/', authMiddleware, commentsController.deleteComment)

export default router
