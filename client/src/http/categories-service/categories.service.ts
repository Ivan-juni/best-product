import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/delete-response'
import { ICategory, ICategoryQuery } from 'models/category.model'
import { CategoryAddingValues, CategoryChangingValues } from './categories.model'
import { ObjectionPage } from 'models/objection-page.model'

export default class CategoriesService {
  static async getCategoryById(id: number): Promise<AxiosResponse<ICategory>> {
    return $api.get<ICategory>(`/categories/${id}`)
  }

  static async getCategories(searchCriteria: ICategoryQuery): Promise<AxiosResponse<ObjectionPage<ICategory[]>>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = 4
    }

    return $api.get<ObjectionPage<ICategory[]>>(`/categories`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async addCategory(category: CategoryAddingValues): Promise<AxiosResponse<ICategory>> {
    return $api.post<ICategory>(`/categories`, category)
  }

  static async updateCategory(id: number, changingValues: CategoryChangingValues): Promise<AxiosResponse<ICategory>> {
    return $api.patch<ICategory>(`/categories?categoryId=${id}`, changingValues)
  }

  static async deleteCategory(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/categories?categoryId=${id}`)
  }
}
