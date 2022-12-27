import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import commentService from '../services/comments.service'
import { ReturnType } from './types/return.type'
import Comment from '../db/models/comment.model'
import Objection from 'objection'

export default class CommentsController {
  // comments
  static async getProductComments(req: Request, res: Response, next: NextFunction): ReturnType<Objection.Page<Comment>> {
    const { productId } = req.query
    const page = +req.query.page || 0
    const limit = +req.query.limit || 5
    const orderByDate: string = req.query.orderByDate ? req.query.orderByDate.toString() : 'high'

    if (!productId) {
      return next(ApiError.internal('Type the product id'))
    }

    if (orderByDate !== 'low' && orderByDate !== 'high') {
      return next(ApiError.internal('Type the correct sort param (low or high)'))
    }

    const comments = await commentService.getProductComments(+productId, { orderByDate, page, limit })

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
    const { productId } = req.query
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
    const { commentId } = req.query

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

  static async updateComment(req: Request, res: Response, next: NextFunction): ReturnType<Comment> {
    const { id } = req.user
    const { commentId } = req.query
    const commentText: string = req.body.text

    if (!commentId) {
      return next(ApiError.internal('Please, type the comment id'))
    }

    if (!commentText) {
      return next(ApiError.internal('Please, type the comment text'))
    }

    if (!id) {
      return next(ApiError.unAuthorizedError())
    }

    const comment = await commentService.updateComment(+id, +commentId, commentText)

    if (!comment) {
      return next(ApiError.badRequest(`Updating comment error`))
    }

    return res.json(comment)
  }
}
