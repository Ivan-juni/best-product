import { ICategory } from 'models/category.model'
import { ObjectionPage } from 'models/objection-page.model'
import { IProduct } from 'models/product.model'

export type FavoritesResponse = ObjectionPage<Array<IProduct & { timeAdded: string; favoritesId: number }>> & { categories?: ICategory[] }
