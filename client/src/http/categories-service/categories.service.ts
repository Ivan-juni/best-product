import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { ICategory, ICategoryQuery } from '../../models/ICategory'
import { CategoryAddingValues, CategoryChangingValues } from './categories.model'
import { ObjectionPage } from '../../models/ObjectionPage.model'

export default class CategoriesService {
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
    return $api.put<ICategory>(`/categories?categoryId=${id}`, changingValues)
  }

  static async deleteCategory(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/categories?categoryId=${id}`)
  }
}
