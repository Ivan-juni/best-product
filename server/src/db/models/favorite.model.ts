import { Model, RelationMappings, RelationMappingsThunk } from 'objection'

export default class Favorite extends Model {
  static get tableName() {
    return 'favorites'
  }

  id: number
  userId: number
  productId: number
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

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'productId'],

      properties: {
        id: { type: 'integer' },
        userId: { type: 'integer' },
        productId: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
