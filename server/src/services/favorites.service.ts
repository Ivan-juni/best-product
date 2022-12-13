import { raw } from 'objection'
import Favorite from '../db/models/favorite.model'
import Product from '../db/models/product.model'
import { findProducts } from '../utils/find-products.util'
import { sort } from '../utils/sort-by.util'
import { DeleteType, IProductsQuery } from './types/products.type'

export default class FavoritesService {
  static async getFavorites(userId: number, searchCriteria: IProductsQuery) {
    try {
      // пагинация
      const limit = +searchCriteria.limit || 5
      const page = +searchCriteria.page || 0

      // параметры для сортировки
      const sortParams = sort(searchCriteria, ['price', 'favoriteStars'])

      const favorites = await Favorite.query()
        .select('favorites.id as favoritesId', 'products.*', 'favorites.createdAt as timeAdded')
        .where((qb) => {
          qb.where({ userId })

          // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
          findProducts(qb, searchCriteria)
        })
        .leftJoin('products', function () {
          this.on('products.id', '=', 'favorites.productId')
        })
        .leftJoin('product_characteristics', function () {
          this.on('product_characteristics.id', '=', 'products.characteristicsId')
        })
        .orderBy(`products.${sortParams.column}`, sortParams.order)
        .page(page, limit)

      return favorites
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addToFavorite(userId: number, productId: number): Promise<Favorite | null> {
    try {
      const favorite = await Favorite.query().findOne({ userId, productId })

      if (favorite) {
        return favorite
      }

      // add to favorite and increment 'favorites' option in Product model
      await Product.query()
        .patch({ favoriteStars: raw('favoriteStars + 1') })
        .where({ id: productId })

      const userFavorites = await Favorite.query().insertAndFetch({
        userId,
        productId,
      })

      return userFavorites
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteFromFavorite(userId: number, productId: number): DeleteType {
    try {
      const favorite = await Favorite.query().findOne({ userId, productId })

      if (!favorite) {
        return { message: "This product isn't on your favorites" }
      }

      // delete from favorite and decrement 'favorites' option in Product model
      await Product.query()
        .patch({ favoriteStars: raw('favoriteStars - 1') })
        .where({ id: productId })

      const deletedQueries = await Favorite.query().delete().where({ userId, productId })

      return deletedQueries
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
