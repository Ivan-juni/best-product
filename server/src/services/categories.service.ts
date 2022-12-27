import Objection from 'objection'
import Category from '../db/models/category.model'
import { ICategoryBody, ICategorySearchCriteria } from './types/categories.type'
import { DeleteType } from './types/products.type'

export default class CategoriesService {
  static async getCategories(searchCriteria: ICategorySearchCriteria): Promise<Objection.Page<Category> | null> {
    try {
      const categories = await Category.query()
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

  static async updateCategory(categoryId: number, changingValues: ICategoryBody): Promise<Category | null> {
    try {
      const oldCategory = await Category.query().select().findById(categoryId)

      if (!oldCategory) {
        throw new Error("Can't find this category")
      }

      // filtering null values
      Object.keys(changingValues).forEach((key) => {
        if (changingValues[key] === null) {
          delete changingValues[key]
        }
      })

      const category = await Category.query().patchAndFetchById(categoryId, changingValues)

      return category
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
