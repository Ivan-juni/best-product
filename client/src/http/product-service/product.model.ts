import { ICategory } from 'models/category.model'
import { IProduct } from 'models/product.model'
import { ObjectionPage } from 'models/objection-page.model'

export type ProductResponse = ObjectionPage<IProduct[]> & { categories?: ICategory[] }

export interface ProductChangingValues {
  name?: string | null
  price?: number | null
  image?: string | File | null
  categoryId?: number | null
  purpose?: string | null
  description?: string | null
  design?: string | null
  connectionType?: string | null
  microphone?: boolean | null
  batteryLiveTime?: number | null
  display?: string | null
}

export interface ProductAddingValues {
  name: string
  price: number
  image: string | File
  categoryId: number
  purpose: string | null
  description: string | null
  design: string | null
  connectionType: string | null
  microphone: boolean | null
  batteryLiveTime: number | null
  display: string | null
}

export type PriceRange = {
  min: string
  max: string
}

export interface ProductMenuInfo {
  purpose: Array<string>
  connectionType: Array<string>
  display: Array<string>
  design: Array<string>
  price: PriceRange
}
