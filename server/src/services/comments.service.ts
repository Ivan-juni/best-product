import Objection from 'objection'
import Comment from '../db/models/comment.model'
import { DeleteType } from './types/products.type'

export default class CommentService {
  static async getComments(userId: number): Promise<Comment[] | null> {
    try {
      const comments = await Comment.query()
        .select('comments.id', 'comments.productId', 'products.name as productName', 'comments.text', 'comments.createdAt', 'comments.updatedAt')
        .where({ userId })
        .leftJoin('products', function () {
          this.on('products.id', '=', 'comments.productId')
        })

      return comments
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addComment(userId: number, productId: number, text: string): Promise<Comment | null> {
    try {
      const comment = await Comment.query().insertAndFetch({
        userId,
        productId,
        text,
      })

      return comment
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteComment(userId: number, commentId: number, role: string): DeleteType {
    try {
      if (role === 'ADMIN') {
        const comment = await Comment.query().findOne({ id: commentId })
        if (!comment) {
          return { message: "Can't find or delete this comment" }
        }
        return Comment.query().delete().where({ id: commentId })
      } else if (role === 'USER') {
        const comment = await Comment.query().findOne({ id: commentId, userId })
        if (!comment) {
          return { message: "Can't find or delete this comment" }
        }
        return Comment.query().delete().where({ id: commentId, userId })
      }
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getProductComments(productId: number, page = 0, limit = 5): Promise<Objection.Page<Comment> | null> {
    try {
      const comments = await Comment.query()
        .select(
          'comments.id',
          'comments.userId',
          'users.email as userEmail',
          'users.firstName as userFirstName',
          'users.lastName as userLastName',
          'users.photo as userPhoto',
          'comments.text',
          'comments.createdAt',
          'comments.updatedAt'
        )
        .where({ productId })
        .leftJoin('users', function () {
          this.on('users.id', '=', 'comments.userId')
        })
        .page(page, limit)

      return comments
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
