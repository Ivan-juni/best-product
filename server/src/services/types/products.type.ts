import Objection from 'objection'
import Product from '../../db/models/product/product.model'

export interface IProductsQuery {
  id?: string
  name?: string
  category?: string
  price?: string // ex: 800-1000
  purpose?: string
  views?: string
  likes?: string
  dislikes?: string
  favoriteStars?: string
  sortByPrice?: 'low' | 'high'
  sortByFavoriteStars?: 'low' | 'high'
  page?: string
  limit?: string
}

export interface IProductBody {
  name: string
  price: string | number
  categoryId: string | number
  image: string
  purpose: string
  description: string
  design: string | null
  connectionType: string | null
  microphone: string | boolean | null
  batteryLiveTime: string | number | null
  display: string | null
}

export interface IProduct {
  name: string
  price: number
  categoryId: number
  image: string
  purpose: string
  description: string
  design: string | null
  connectionType: string | null
  microphone: boolean | null
  batteryLiveTime: number | null
  display: string | null
}

export type resultType = Promise<
  | {
      products: Product[]
      categories: {
        id: number
        parent: number
        name: string
      }[]
      total: number
    }
  | Objection.Page<Product>
  | null
>

export type StatisticsType = Promise<{
  topViews: Product[]
  topLikes: Product[]
  topDislikes: Product[]
  topFavoriteStars: Product[]
} | null>

export type DeleteType = Promise<number | { message: string } | null>
