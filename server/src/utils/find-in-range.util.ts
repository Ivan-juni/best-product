import Objection from 'objection'
import Product from '../db/models/product/product.model'

export const findInRange = (
  qb: Objection.QueryBuilder<Product, Product[]>,
  parametr: string,
  searchCriteria
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
