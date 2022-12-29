import Objection from 'objection'
import Comment from '../db/models/comment.model'
import { sort } from '../utils/order-by.util'
import { DeleteType } from './types/products.type'

export default class CommentService {
  static async getComments(userId: number): Promise<Comment[]> {
    return Comment.query()
      .select('comments.id', 'comments.productId', 'products.name as productName', 'comments.text', 'comments.createdAt', 'comments.updatedAt')
      .where({ userId })
      .leftJoin('products', function () {
        this.on('products.id', '=', 'comments.productId')
      })
  }

  static async getProductComments(
    productId: number,
    searchCriteria: { orderByDate: string; page: number; limit: number }
  ): Promise<Objection.Page<Comment>> {
    // параметры для сортировки
    const sortParams = sort(searchCriteria, ['date'])

    return Comment.query()
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
      .orderBy(`comments.createdAt`, sortParams[0].order)
      .page(searchCriteria.page, searchCriteria.limit)
  }

  static async addComment(userId: number, productId: number, text: string): Promise<Comment> {
    return Comment.query().insertAndFetch({
      userId,
      productId,
      text,
    })
  }

  static async updateComment(userId: number, commentId: number, text: string): Promise<Comment> {
    try {
      const oldComment = await Comment.query().findOne({ userId, id: commentId })

      const comment = await oldComment.$query().patchAndFetch({
        text,
      })

      return comment
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteComment(userId: number, commentId: number, role: string): DeleteType {
    if (role === 'ADMIN') {
      return Comment.query().delete().where({ id: commentId })
    } else if (role === 'USER') {
      return Comment.query().delete().where({ id: commentId, userId })
    }
  }
}
