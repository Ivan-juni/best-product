import { Model } from 'objection'

export default class Category extends Model {
  static get tableName() {
    return 'categories'
  }

  id: number
  parent: string
  name: number
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get parentColumn(): string {
    return 'parent'
  }

  static get nameColumn(): string {
    return 'name'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['parent', 'name'],

      properties: {
        id: { type: 'integer' },
        parent: { type: 'integer' },
        name: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
