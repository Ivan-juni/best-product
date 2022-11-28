import { raw } from 'objection'
import Favorite from '../db/models/favorite/favorite.model'
import Product from '../db/models/product/product.model'

export default class FavoritesService {
  static async getFavorites(userId: number): Promise<Favorite[] | null> {
    try {
      const favorites = await Favorite.query()
        .select(
          'favorites.id',
          'products.*',
          'favorites.createdAt',
          'favorites.updatedAt'
        )
        .where({ userId })
        .leftJoin('products', function () {
          this.on('products.id', '=', 'favorites.productId')
        })

      return favorites
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addToFavorite(
    userId: number,
    productId: number
  ): Promise<Favorite | null> {
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

  static async deleteFromFavorite(
    userId: number,
    productId: number
  ): Promise<number | { message: string } | null> {
    try {
      const favorite = await Favorite.query().findOne({ userId, productId })

      if (!favorite) {
        return { message: "This product isn't on your favorites" }
      }

      // delete from favorite and decrement 'favorites' option in Product model
      await Product.query()
        .patch({ favoriteStars: raw('favoriteStars - 1') })
        .where({ id: productId })

      const deletedQueries = await Favorite.query()
        .delete()
        .where({ userId, productId })

      return deletedQueries
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
