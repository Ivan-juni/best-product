import Objection from 'objection'
import Favorite from '../db/models/favorite/favorite.model'
import Product from '../db/models/product/product.model'
import { IProductsQuery } from '../services/types/products.type'

export const searchUtil = (
  qb: Objection.QueryBuilder<Product, Product[]> | Objection.QueryBuilder<Favorite, Favorite[]>,
  searchCriteria: IProductsQuery,
  parametr: string
) => {
  const array = searchCriteria[parametr].split(',')

  qb.andWhere(`product_characteristics.${parametr}`, 'like', `%${array[0]}%`)

  for (let index = 1; index < array.length; index++) {
    const item = array[index]

    qb.orWhere(`product_characteristics.${parametr}`, 'like', `%${item}%`)
  }
}

export const findInRange = (
  qb: Objection.QueryBuilder<Product, Product[]> | Objection.QueryBuilder<Favorite, Favorite[]>,
  parametr: string,
  searchCriteria: IProductsQuery
) => {
  const parametrArray = searchCriteria[parametr].split('-')

  if (parametrArray.length > 1 && parametrArray[1]) {
    // Ex: if ?parametr=400-1000
    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]).andWhere(`products.${parametr}`, '<=', +parametrArray[1])
  } else if (parametrArray.length == 1 && !parametrArray[1]) {
    // Ex: if ?parametr=400
    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0])
  }
}

export const findProducts = (
  qb: Objection.QueryBuilder<Product, Product[]> | Objection.QueryBuilder<Favorite, Favorite[]>,
  searchCriteria: IProductsQuery
) => {
  if (searchCriteria.id) {
    qb.andWhere('products.id', '=', +searchCriteria.id)
  }

  if (searchCriteria.name) {
    qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`)
  }

  if (searchCriteria.purpose) {
    searchUtil(qb, searchCriteria, 'purpose')
  }

  if (searchCriteria.display) {
    searchUtil(qb, searchCriteria, 'display')
  }

  if (searchCriteria.connectionType) {
    searchUtil(qb, searchCriteria, 'connectionType')
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
