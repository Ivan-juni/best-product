import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { IProduct, IProductQuery } from '../../models/IProduct.model'
import { ProductChangingValues, ProductResponse } from './product.model'

export default class ProductService {
  static async getProducts(searchCriteria: IProductQuery): Promise<AxiosResponse<ProductResponse>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = '6'
    }
    if (!searchCriteria.page) {
      searchCriteria.page = '0'
    }

    return $api.get<ProductResponse>(`/products`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async editProduct(id: number, changingValues: ProductChangingValues): Promise<AxiosResponse<IProduct>> {
    const formData = new FormData()
    if (changingValues.image) {
      formData.append('image', changingValues.image)
      return $api.put<IProduct>(`/products?productId=${id}`, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    } else {
      return $api.put<IProduct>(`/products?productId=${id}`, changingValues, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
    }
  }

  static async deleteProduct(id: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/products?productId=${id}`)
  }
}