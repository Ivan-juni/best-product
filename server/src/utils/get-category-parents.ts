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
    // родители введенной категории
    let categoryParents: Array<{
      id: number
      parent: number
      name: string
    }> = []

    // находим id написанной категории
    const categoryId = await getCategoryId(searchCriteria.category)

    // получаем список категорий родителей
    const knex = Category.knex()
    const parentResult = await knex.raw(`SELECT t2.id,
                t2.parent,
                t2.name
                from (
                  select @r as _id,
                    (select @r := parent from categories where id = _id) AS parent,
                    @l := @l + 1 AS lvl from (select @r := ${categoryId}, @l := 0) vars, categories c
                    where @r <> 0) t1
                    join categories t2
                    on  t1._id = t2.id
                    order by t1.lvl desc`)

    categoryParents = parentResult[0]

    return categoryParents
  } else {
    return []
  }
}
