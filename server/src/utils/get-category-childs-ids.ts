import Category from '../db/models/category.model'
import { IProductsQuery } from '../services/types/products.type'
import { getCategoryId } from './get-category-id.util'

export const getCategoryChilds = async (
  searchCriteria: IProductsQuery
): Promise<{
  categoryIds: string
}> => {
  if (searchCriteria.category) {
    // находим id написанной категории
    const categoryId = await getCategoryId(searchCriteria.category)
    // находим id дочерних категорий
    const category = Category.knex()

    const childResult = await category.raw(`WITH RECURSIVE cte(id, parent, name) as 
                        (
                        SELECT id, parent, name FROM categories WHERE id = ${categoryId}
                        UNION ALL
                        SELECT c.id, c.parent, c.name
                        FROM categories c
                        INNER JOIN cte on c.parent = cte.id
                        )
                        SELECT GROUP_CONCAT( cte.id SEPARATOR "," ) AS categoryIds FROM cte`)

    const categoryChilds: { categoryIds: string } = childResult[0][0]

    return categoryChilds
  } else {
    return { categoryIds: '' }
  }
}
