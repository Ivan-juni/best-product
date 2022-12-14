import Objection from 'objection'
import Product from '../../db/models/product.model'

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
  connectionType?: string
  display?: string
  microphone?: 'true' | 'built-in' | 'false' | 'none'
  orderByPrice?: 'low' | 'high'
  orderByFavoriteStars?: 'low' | 'high'
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
  // microphone: boolean | null
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
>

export type StatisticsType = Promise<{
  topViews: Product[]
  topLikes: Product[]
  topDislikes: Product[]
  topFavoriteStars: Product[]
}>

export type DeleteType = Promise<number>
