import { OrderByDirection } from 'objection'
import { IProductsQuery } from '../services/types/products.type'

export const sort = (
  searchCriteria: IProductsQuery | { orderByDate?: string },
  params: Array<string> // price, favoriteStars, date
): {
  column: string
  order: OrderByDirection
}[] => {
  // sorting params
  const test: Array<{ column: string; order: OrderByDirection }> = []
  let order: OrderByDirection = 'asc'

  params.forEach((param) => {
    // сортировка
    // first letter to upper case
    const formatedParam = `orderBy${param.charAt(0).toLocaleUpperCase() + param.slice(1)}`

    if (searchCriteria[formatedParam]) {
      // по возрастанию
      if (searchCriteria[formatedParam] === 'low') {
        order = 'asc'
      }
      // по убыванию
      if (searchCriteria[formatedParam] === 'high') {
        order = 'desc'
      }

      test.push({
        column: param,
        order: order,
      })
    }
  })

  if (test.length === 0) {
    test.push({
      column: 'id',
      order: 'asc',
    })
  }

  return test
}
