import { ICategory } from '../../models/ICategory'
import { ObjectionPage } from '../../models/ObjectionPage.model'
import { IProduct } from '../../models/IProduct.model'

export type FavoritesResponse = ObjectionPage<Array<IProduct & { timeAdded: string; favoritesId: number }>> & { categories?: ICategory[] }
