import Category from '../db/models/category.model'
import { DeleteType } from './types/products.type'

export default class CategoriesService {
  static async getCategories(searchCriteria: { categoryId?: number | null; categoryName?: string | null }): Promise<Category[] | null> {
    try {
      const categories = await Category.query()
        .select()
        .from('categories')
        .where((qb) => {
          if (searchCriteria.categoryId) {
            qb.where('categories.id', '=', +searchCriteria.categoryId)
          }
          if (searchCriteria.categoryName) {
            qb.orWhere('categories.name', 'like', `%${searchCriteria.categoryName}`)
          }
        })

      return categories
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addCategory(categoryValues: { name: string; parent: number }): Promise<Category | null> {
    try {
      const productCategory = await Category.query().findOne({
        name: categoryValues.name,
      })

      if (productCategory) {
        return productCategory
      }

      const category = await Category.query().insertAndFetch({
        name: categoryValues.name,
        parent: categoryValues.parent,
      })

      return category
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteCategory(categoryId: number): DeleteType {
    try {
      const category = await Category.query().findById(categoryId)

      if (!category) {
        return { message: "This product isn't on your favorites" }
      }

      const deletedCategories = await Category.query().deleteById(categoryId)

      return deletedCategories
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
