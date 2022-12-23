import Category from '../db/models/category.model'
import { IProductsQuery } from '../services/types/products.type'
import { getCategoryId } from './get-category-id.util'

export const getCategoryChilds = async (
  searchCriteria: IProductsQuery
): Promise<{
  categoryIds: string
}> => {
  if (searchCriteria.category) {
    let categoryChilds: { categoryIds: string } = { categoryIds: '' }

    // находим id написанной категории
    const categoryId = await getCategoryId(searchCriteria.category)
    // находим id дочерних категорий
    const category = Category.knex()
    const childResult = await category.raw(`SELECT GROUP_CONCAT( lv SEPARATOR "," ) AS categoryIds FROM (
                   SELECT @pv:=(
                       SELECT GROUP_CONCAT( id SEPARATOR "," ) FROM categories WHERE FIND_IN_SET( parent, @pv )
                       ) AS lv FROM categories
                       JOIN
                       (SELECT @pv:=${categoryId}) tmp
                   ) a
                   WHERE lv IS NOT NULL;`)

    categoryChilds = childResult[0][0]

    // для корректного поиска также добавляем айди введенной категории
    if (categoryChilds.categoryIds === '' || categoryChilds.categoryIds == null) {
      categoryChilds.categoryIds = `${categoryId}`
    } else {
      categoryChilds.categoryIds.concat(`, ${categoryId}`)
    }

    return categoryChilds
  } else {
    return { categoryIds: '' }
  }
}
