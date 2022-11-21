import { Model, RelationMappings, RelationMappingsThunk } from 'objection'
import Comment from '../comment/comment.model'
import Favorite from '../favorite/favorite.model'

export default class User extends Model {
  static get tableName() {
    return 'users'
  }

  id: number
  email: string
  phone: number
  password: string
  firstName: string
  lastName: string
  role: string
  createdAt: Date
  updatedAt: Date

  $beforeInsert() {
    this.createdAt = new Date()
  }

  $beforeUpdate() {
    this.updatedAt = new Date()
  }

  static get emailColumn(): string {
    return 'email'
  }

  static get phoneColumn(): string {
    return 'phone'
  }

  static get passwordColumn(): string {
    return 'password'
  }

  static get firstNameColumn(): string {
    return 'firstName'
  }

  static get lastNameColumn(): string {
    return 'lastName'
  }

  static get roleColumn(): string {
    return 'role'
  }

  fullName(): string {
    return this.firstName + ' ' + this.lastName
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName', 'role'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        phone: { type: ['integer', 'null'] },
        password: { type: 'string' },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        role: { type: 'string', default: 'USER', minLength: 4, maxLength: 5 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    }
  }

  static relationMappings: RelationMappings | RelationMappingsThunk = {
    favorites: {
      relation: Model.ManyToManyRelation,
      modelClass: Favorite,
      join: {
        from: 'users.id',
        through: {
          from: 'favorites.userId',
          to: 'favorites.productId',
        },
        to: 'products.id',
      },
    },

    comments: {
      relation: Model.ManyToManyRelation,
      modelClass: Comment,
      join: {
        from: 'users.id',
        through: {
          from: 'comments.userId',
          to: 'comments.productId',
        },
        to: 'products.id',
      },
    },
  }
}
