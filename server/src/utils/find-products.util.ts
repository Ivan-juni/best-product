import Objection from 'objection'
import Favorite from '../db/models/favorite/favorite.model'
import Product from '../db/models/product/product.model'
import { IProductsQuery } from '../services/types/products.type'
import { findInRange } from './find-in-range.util'

export const findProducts = (
  qb:
    | Objection.QueryBuilder<Product, Product[]>
    | Objection.QueryBuilder<Favorite, Favorite[]>,
  searchCriteria: IProductsQuery
) => {
  if (searchCriteria.id) {
    qb.andWhere('products.id', '=', +searchCriteria.id)
  }

  if (searchCriteria.name) {
    qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`)
  }

  if (searchCriteria.purpose) {
    const purposes = searchCriteria.purpose.split(',')

    purposes.forEach((purpose) => {
      qb.andWhere('product_characteristics.purpose', 'like', `%${purpose}%`)
    })
  }

  if (searchCriteria.display) {
    const displays = searchCriteria.display.split(',')

    displays.forEach((display) => {
      qb.andWhere('product_characteristics.display', 'like', `%${display}%`)
    })
  }

  if (searchCriteria.connectionType) {
    const connectionTypes = searchCriteria.connectionType.split(',')

    connectionTypes.forEach((connectionType) => {
      qb.andWhere(
        'product_characteristics.connectionType',
        'like',
        `%${connectionType}%`
      )
    })
  }

  if (searchCriteria.microphone && searchCriteria.microphone === 'true') {
    const microphone = true
    qb.andWhere('product_characteristics.microphone', '=', microphone)
  }

  if (searchCriteria.price) {
    findInRange(qb, 'price', searchCriteria)
  }

  if (searchCriteria.views) {
    findInRange(qb, 'views', searchCriteria)
  }

  if (searchCriteria.likes) {
    findInRange(qb, 'likes', searchCriteria)
  }

  if (searchCriteria.dislikes) {
    findInRange(qb, 'dislikes', searchCriteria)
  }

  if (searchCriteria.favoriteStars) {
    findInRange(qb, 'favoriteStars', searchCriteria)
  }
}
