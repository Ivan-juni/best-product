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
