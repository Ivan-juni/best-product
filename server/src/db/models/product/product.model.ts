import { Model, RelationMappings, RelationMappingsThunk } from 'objection'
import Category from '../category/category.model'
import ProductCharacteristics from '../product-characteristics/product-characteristics.model'

export default class Product extends Model {
  static get tableName() {
    return 'products'
  }

  id: number
  name: string
  price: number
  image: string
  categoryId: number
  likes: number
  dislikes: number
  views: number
  favoriteStars: number
  charasteristicsId: number
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get nameColumn(): string {
    return 'name'
  }

  static get priceColumn(): string {
    return 'price'
  }

  static get imageColumn(): string {
    return 'image'
  }

  static get categoryIdColumn(): string {
    return 'categoryId'
  }

  static get likesColumn(): string {
    return 'likes'
  }

  static get dislikesColumn(): string {
    return 'dislikes'
  }

  static get viewsColumn(): string {
    return 'views'
  }

  static get favoriteStarsColumn(): string {
    return 'favoriteStars'
  }

  static get charasteristicsIdColumn(): string {
    return 'charasteristicsId'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'name',
        'price',
        'image',
        'categoryId',
        'favoriteStars',
        'charasteristicsId',
      ],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', maxLength: 20 },
        price: { type: 'integer' },
        image: { type: 'string' },
        categoryId: { type: 'integer', maxLength: 5 },
        likes: { type: 'integer', defalut: 0 },
        dislikes: { type: 'integer', defalut: 0 },
        views: { type: 'integer', defalut: 0 },
        favoriteStars: { type: 'integer', defalut: 0 },
        charasteristicsId: { type: 'integer', maxLength: 5 },
      },
    }
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    categories: {
      relation: Model.HasOneRelation,
      modelClass: Category,
      join: {
        from: 'products.categoryId',
        to: 'categories.id',
      },
    },

    characteristics: {
      relation: Model.HasOneRelation,
      modelClass: ProductCharacteristics,
      join: {
        from: 'products.characteristicsId',
        to: 'product_characteristics.id',
      },
    },
  }
}
