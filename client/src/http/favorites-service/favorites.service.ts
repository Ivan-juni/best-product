import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { IProduct, IProductQuery } from '../../models/IProduct.model'
import { ProductResponse } from '../product-service/product.model'

export default class FavoriteService {
  static async getFavorites(searchCriteria: IProductQuery): Promise<AxiosResponse<ProductResponse>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = '6'
    }
    if (!searchCriteria.page) {
      searchCriteria.page = '0'
    }

    return $api.get<ProductResponse>(`/favorites`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async addToFavorites(productId: number): Promise<AxiosResponse<IProduct>> {
    return $api.post<IProduct>(`/favorites?productId=${productId}`)
  }

  static async deleteFromFavorites(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/favorites?productId=${productId}`)
  }
}
