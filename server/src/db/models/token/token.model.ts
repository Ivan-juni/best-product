import { Model } from 'objection'

export default class Token extends Model {
  static get tableName() {
    return 'tokens'
  }

  id: number
  refreshToken: string
  userId: number

  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get refreshTokenColumn(): string {
    return 'email'
  }

  static get userIdColumn(): string {
    return 'phone'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['refreshToken', 'userId'],

      properties: {
        id: { type: 'integer' },
        refreshToken: { type: 'string' },
        userId: { type: 'integer' },

        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
