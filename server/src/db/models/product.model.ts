import { Model, RelationMappings, RelationMappingsThunk } from 'objection'
import Category from './category.model'
import Favorite from './favorite.model'
import Comment from './comment.model'
import Image from './image.module'
import ProductCharacteristics from './product-characteristics.model'

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
  characteristicsId: number
  createdAt: Date
  updatedAt: Date

  // price
  min?: number
  max?: number

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

  static get characteristicsIdColumn(): string {
    return 'characteristicsId'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'price', 'image', 'categoryId', 'favoriteStars', 'characteristicsId'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', maxLength: 40 },
        price: { type: 'integer' },
        image: { type: 'string' },
        categoryId: { type: 'integer' },
        likes: { type: 'integer', default: 0 },
        dislikes: { type: 'integer', default: 0 },
        views: { type: 'integer', default: 0 },
        favoriteStars: { type: 'integer', default: 0 },
        characteristicsId: { type: 'integer' },
      },
    }
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    category: {
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

    images: {
      relation: Model.HasManyRelation,
      modelClass: Image,
      join: {
        from: 'products.id',
        to: 'images.productId',
      },
    },

    favorites: {
      relation: Model.ManyToManyRelation,
      modelClass: Favorite,
      join: {
        from: 'products.id',
        through: {
          from: 'favorites.productId',
          to: 'favorites.userId',
        },
        to: 'users.id',
      },
    },

    comments: {
      relation: Model.ManyToManyRelation,
      modelClass: Comment,
      join: {
        from: 'products.id',
        through: {
          from: 'comments.productId',
          to: 'comments.userId',
        },
        to: 'users.id',
      },
    },
  }
}
