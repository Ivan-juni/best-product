import { ICategory } from './category.model'
import { ICharacteristics } from './characteristics.model'
import { IImages } from './images.model'

export interface IProduct {
  id: number
  name: string
  price: number
  image: string
  category: ICategory
  likes: number
  dislikes: number
  views: number
  favoriteStars: number
  characteristics: ICharacteristics
  images: IImages[]
}

export interface IProductQuery {
  id?: number | null
  name?: string | null
  category?: string | null
  price?: string | null
  purpose?: string | null
  views?: string | null
  likes?: string | null
  dislikes?: string | null
  favoriteStars?: string | null
  connectionType?: string | null
  display?: string | null
  microphone?: 'true' | null
  orderByPrice?: 'low' | 'high' | null
  orderByFavoriteStars?: 'low' | 'high' | null
  page?: number | null
  limit?: number | null
}
