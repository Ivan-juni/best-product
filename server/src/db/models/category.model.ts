import { AnyQueryBuilder, Model, Modifiers } from 'objection'

export default class Category extends Model {
  static get tableName() {
    return 'categories'
  }

  id: number
  parent: number
  name: string
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

  static get modifiers(): Modifiers<AnyQueryBuilder> {
    return {
      selectNameIdParent(builder) {
        builder.select('id', 'name', 'parent')
      },
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['parent', 'name'],

      properties: {
        id: { type: 'integer' },
        parent: { type: 'integer' },
        name: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
