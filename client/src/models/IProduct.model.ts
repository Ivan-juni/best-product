import { ICategory } from './ICategory'
import { ICharacteristics } from './ICharacteristics'
import { IImages } from './IImages.model'

export interface IProduct {
  id: number
  name: string
  price: number
  image: string
  categories: ICategory
  likes: number
  dislikes: number
  views: number
  favoriteStars: number
  characteristics: ICharacteristics
  images: IImages[]
}

export interface IProductQuery {
  id?: string | null
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
  sortByPrice?: 'low' | 'high' | null
  sortByFavoriteStars?: 'low' | 'high' | null
  page?: string | null
  limit?: string | null
}