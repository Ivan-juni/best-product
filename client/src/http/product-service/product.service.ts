import $api from '../index'
import { AxiosResponse } from 'axios'
import { DeleteResponse } from '../models/DeleteResponse'
import { IProduct, IProductQuery } from '../../models/IProduct.model'
import { ProductAddingValues, ProductChangingValues, ProductMenuInfo, ProductResponse } from './product.model'
import { IImages } from '../../models/IImages.model'
import { IPriceDynamics, IStats } from '../../models/IStats.model'

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

  static async getMenuInfo(searchCriteria: IProductQuery): Promise<AxiosResponse<ProductMenuInfo>> {
    if (!searchCriteria.limit) {
      searchCriteria.limit = '6'
    }
    if (!searchCriteria.page) {
      searchCriteria.page = '0'
    }

    return $api.get<ProductMenuInfo>(`/products/menuInfo`, {
      params: {
        ...searchCriteria,
      },
    })
  }

  static async addProduct(product: ProductAddingValues): Promise<AxiosResponse<IProduct>> {
    const formData = new FormData()
    formData.append('image', product.image)
    return $api.post<IProduct>(
      `/products`,
      { ...product, ...formData },
      {
        headers: { 'Content-type': 'multipart/form-data' },
      }
    )
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

  static async addImage(id: number, images: File[]): Promise<AxiosResponse<IImages>> {
    const formData = new FormData()

    images.forEach((image) => {
      formData.append('image', image)
    })

    return $api.post<IImages>(`/products/images?productId=${id}`, formData, {
      headers: { 'Content-type': 'multipart/form-data' },
    })
  }

  static async deleteImage(productId: number, imageId: number): Promise<AxiosResponse<DeleteResponse>> {
    return $api.delete<DeleteResponse>(`/products/images?productId=${productId}&imageId=${imageId}`)
  }

  static async getStats(quantity?: number): Promise<AxiosResponse<IStats>> {
    return $api.get<IStats>(`/products/statistics`, {
      params: {
        quantity,
      },
    })
  }
  static async getPriceDynamics(productId: number): Promise<AxiosResponse<IPriceDynamics[]>> {
    return $api.get<IPriceDynamics[]>(`/products/statistics/price-dynamics`, {
      params: {
        productId,
      },
    })
  }
}
