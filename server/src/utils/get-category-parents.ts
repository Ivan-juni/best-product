import Category from '../db/models/category.model'
import { IProductsQuery } from '../services/types/products.type'
import { getCategoryId } from './get-category-id.util'

export const getCategoryParents = async (
  searchCriteria: IProductsQuery
): Promise<
  | {
      id: number
      parent: number
      name: string
    }[]
  | []
> => {
  if (searchCriteria.category) {
    // находим id написанной категории
    const categoryId = await getCategoryId(searchCriteria.category)

    // получаем список категорий родителей
    const knex = Category.knex()
    const parentResult = await knex.raw(`WITH RECURSIVE cte(id, parent, name) as 
                        (
                        SELECT id, parent, name FROM categories WHERE id = ${categoryId}
                        UNION ALL
                        
                        SELECT c.id, c.parent, c.name
                        FROM categories c
                        INNER JOIN cte on c.id = cte.parent
                        )
                        SELECT * FROM cte ORDER BY id ASC`)

    const categoryParents: Array<{
      id: number
      parent: number
      name: string
    }> = parentResult[0]

    return categoryParents
  } else {
    return []
  }
}
