import { OrderByDirection } from 'objection'
import { IProductsQuery } from '../services/types/products.type'

export const sort = (
  searchCriteria: IProductsQuery | { orderByDate?: string },
  params: Array<string> // price, favoriteStars
): {
  column: string
  order: OrderByDirection
} => {
  // sorting params
  const sortParams: { column: string; order: OrderByDirection } = {
    column: 'id',
    order: 'asc',
  }

  // отсортирует по последнему заданному параметру
  params.forEach((param) => {
    // сортировка
    // first letter to upper case
    const formatedParam = `orderBy${param.charAt(0).toLocaleUpperCase() + param.slice(1)}`

    if (searchCriteria[formatedParam]) {
      sortParams.column = param
      // по возрастанию
      if (searchCriteria[formatedParam] === 'low') {
        sortParams.order = 'asc'
      }
      // по убыванию
      if (searchCriteria[formatedParam] === 'high') {
        sortParams.order = 'desc'
      }
    }
  })

  return sortParams
}
