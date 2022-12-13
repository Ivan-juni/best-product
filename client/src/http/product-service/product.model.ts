import { ICategory } from '../../models/ICategory'
import { IProduct } from '../../models/IProduct.model'
import { ObjectionPage } from '../../models/ObjectionPage.model'

export type ProductResponse = ObjectionPage<IProduct[]> & { categories?: ICategory[] }

export interface ProductChangingValues {
  name?: string | null
  price?: number | null
  image?: string | null
  categoryId?: number | null
  purpose?: string | null
  description?: string | null
  design?: string | null
  connectionType?: string | null
  microphone?: boolean | null
  batteryLiveTime?: number | null
  display?: string | null
}
