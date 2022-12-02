import Objection from 'objection'
import Product from '../db/models/product/product.model'
import Favorite from '../db/models/favorite/favorite.model'
import { IProductsQuery } from '../services/types/products.type'

export const findInRange = (
  qb:
    | Objection.QueryBuilder<Product, Product[]>
    | Objection.QueryBuilder<Favorite, Favorite[]>,
  parametr: string,
  searchCriteria: IProductsQuery
) => {
  const parametrArray = searchCriteria[parametr].split('-')

  if (parametrArray.length > 1 && parametrArray[1]) {
    // Ex: if ?parametr=400-1000
    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]).andWhere(
      `products.${parametr}`,
      '<=',
      +parametrArray[1]
    )
  } else if (parametrArray.length == 1 && !parametrArray[1]) {
    // Ex: if ?parametr=400
    qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0])
  }
}
