import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { ICategory, ICategoryQuery } from '../../models/ICategory'
import { CategoryAddingValues } from './categories.model'

export default class CategoriesService {
  static async getCategories(searchCriteria: ICategoryQuery): Promise<AxiosResponse<ICategory[]>> {
    return $api.get<ICategory[]>(`/categories`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async addCategory(category: CategoryAddingValues): Promise<AxiosResponse<ICategory>> {
    return $api.post<ICategory>(`/categories`, category)
  }

  static async deleteCategory(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/categories?categoryId=${id}`)
  }
}
