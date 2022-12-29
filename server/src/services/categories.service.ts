import Objection from 'objection'
import Category from '../db/models/category.model'
import { ICategoryBody, ICategorySearchCriteria } from './types/categories.type'
import { DeleteType } from './types/products.type'

export default class CategoriesService {
  static async getCategoryById(id: number): Promise<Category> {
    return Category.query().findById(id)
  }

  static async getCategories(searchCriteria: ICategorySearchCriteria): Promise<Objection.Page<Category>> {
    return Category.query()
      .select()
      .from('categories')
      .where((qb) => {
        if (searchCriteria.categoryId) {
          qb.where('categories.id', '=', +searchCriteria.categoryId)
        }
        if (searchCriteria.categoryName) {
          qb.orWhere('categories.name', 'like', `%${searchCriteria.categoryName}%`)
        }
      })
      .page(searchCriteria.page, searchCriteria.limit)
  }

  static async addCategory(categoryValues: { name: string; parent: number }): Promise<Category> {
    return Category.query().insertAndFetch({
      name: categoryValues.name,
      parent: categoryValues.parent,
    })
  }

  static async deleteCategory(categoryId: number): DeleteType {
    return Category.query().deleteById(categoryId)
  }

  static async updateCategory(categoryId: number, changingValues: ICategoryBody): Promise<Category> {
    // filtering null values
    Object.keys(changingValues).forEach((key) => {
      if (changingValues[key] === null) {
        delete changingValues[key]
      }
    })

    return Category.query().patchAndFetchById(categoryId, changingValues)
  }
}
