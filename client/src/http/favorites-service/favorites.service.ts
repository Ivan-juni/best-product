import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { IProduct, IProductQuery } from '../../models/IProduct.model'
import { FavoritesResponse } from './favorites.model'

export default class FavoriteService {
  static async getFavorites(searchCriteria: IProductQuery): Promise<AxiosResponse<FavoritesResponse>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = '9'
    }
    if (!searchCriteria.page) {
      searchCriteria.page = '0'
    }

    return $api.get<FavoritesResponse>(`/favorites`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async getFavoritesIds(): Promise<AxiosResponse<{ ids: string }[]>> {
    return $api.get<{ ids: string }[]>(`/favorites/ids`)
  }

  static async addToFavorites(productId: number): Promise<AxiosResponse<IProduct>> {
    return $api.post<IProduct>(`/favorites?productId=${productId}`)
  }

  static async deleteFromFavorites(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/favorites?productId=${productId}`)
  }

  // likes / dislikes / views
  static async setLike(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.post<DeleteResponse>(`/favorites/likes?productId=${productId}`)
  }
  static async setDislike(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.post<DeleteResponse>(`/favorites/dislikes?productId=${productId}`)
  }
  static async setView(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.post<DeleteResponse>(`/favorites/views?productId=${productId}`)
  }

  static async deleteLike(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/favorites/likes?productId=${productId}`)
  }
  static async deleteDislike(productId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/favorites/dislikes?productId=${productId}`)
  }
}
