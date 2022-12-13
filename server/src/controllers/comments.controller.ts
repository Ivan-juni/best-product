import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import commentService from '../services/comments.service'
import { ReturnType } from './types/return.type'
import Comment from '../db/models/comment.model'
import Objection from 'objection'

export default class CommentsController {
  // comments
  static async getProductComments(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Comment>> {
    const { productId } = req.params
    const page = +req.query.page || 0
    const limit = +req.query.page || 5

    if (!productId) {
      return next(ApiError.internal('Type the product id'))
    }

    const comments = await commentService.getProductComments(+productId, page, limit)

    if (!comments) {
      return next(ApiError.badRequest(`Fetching comments error`))
    }

    return res.json(comments)
  }

  static async getUserComments(req: Request, res: Response, next: NextFunction): ReturnType<Comment[]> {
    const { id } = req.user

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const comments = await commentService.getComments(+id)

    if (!comments) {
      return next(ApiError.badRequest(`Fetching comments error`))
    }

    return res.json(comments)
  }

  static async addComment(req: Request, res: Response, next: NextFunction): ReturnType<Comment> {
    const { id } = req.user
    const { productId } = req.params
    const commentText: string = req.body.text

    if (!productId) {
      return next(ApiError.internal('Type product id'))
    }

    if (!commentText) {
      return next(ApiError.internal('Please, type the cooment text'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const comment = await commentService.addComment(+id, +productId, commentText)

    if (!comment) {
      return next(ApiError.badRequest(`Adding comment error`))
    }

    return res.json(comment)
  }

  static async deleteComment(req: Request, res: Response, next: NextFunction): ReturnType<{ message: string }> {
    const { id, role } = req.user
    const { commentId } = req.params

    if (!commentId) {
      return next(ApiError.internal('Type comment id'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const result = await commentService.deleteComment(+id, +commentId, role)

    if (!result) {
      return next(ApiError.badRequest(`Deletion comment error`))
    }

    if (typeof result == 'number') {
      return res.json({ message: `Successfully deleted ${result} comments` })
    } else {
      return res.json(result)
    }
  }
}
