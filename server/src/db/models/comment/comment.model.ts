import { Model } from 'objection'

export default class Comment extends Model {
  static get tableName() {
    return 'comments'
  }

  id: number
  userId: number
  productId: number
  text: string
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get userIdColumn(): string {
    return 'userId'
  }

  static get productIdColumn(): string {
    return 'productId'
  }

  static get textColumn(): string {
    return 'text'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'productId', 'text'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        productId: { type: 'integer' },
        text: { type: 'string', minLength: 1, maxLength: 300 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
