import { AnyQueryBuilder, Model, Modifiers } from 'objection'

export default class Image extends Model {
  static get tableName() {
    return 'images'
  }

  id: number
  productId: number
  src: string
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get productIdColumn(): string {
    return 'productId'
  }

  static get srcColumn(): string {
    return 'src'
  }

  static get modifiers(): Modifiers<AnyQueryBuilder> {
    return {
      selectIdAndSrc(builder) {
        builder.select('id', 'src')
      },
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['productId', 'src'],

      properties: {
        id: { type: 'integer' },
        productId: { type: 'integer' },
        src: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }
}
