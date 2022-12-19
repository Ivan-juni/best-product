import Objection, { raw } from 'objection'
import Favorite from '../db/models/favorite.model'
import Product from '../db/models/product.model'
import { findProducts } from '../utils/find-products.util'
import { sort } from '../utils/sort-by.util'
import { DeleteType, IProductsQuery } from './types/products.type'

export default class FavoritesService {
  static async getFavorites(userId: number, searchCriteria: IProductsQuery): Promise<Objection.Page<Product> | null> {
    try {
      // пагинация
      const limit = +searchCriteria.limit || 5
      const page = +searchCriteria.page || 0

      // параметры для сортировки
      const sortParams = sort(searchCriteria, ['price', 'favoriteStars'])

      const favorites = await Product.query()
        .select(
          'favorites.id as favoritesId',
          'products.id',
          'products.name',
          'products.price',
          'products.image',
          'products.likes',
          'products.dislikes',
          'products.views',
          'products.favoriteStars',
          'products.createdAt',
          'products.updatedAt',
          'favorites.createdAt as timeAdded'
        )
        .where((qb) => {
          qb.where('favorites.userId', '=', `${userId}`)

          // id, name, purpose, display, connectionType, microphone, price, views, likes, dislikes, favoriteStars
          findProducts(qb, searchCriteria)
        })
        .leftJoin('favorites', function () {
          this.on('favorites.productId', '=', 'products.id')
        })
        .leftJoin('product_characteristics', function () {
          this.on('product_characteristics.id', '=', 'products.characteristicsId')
        })
        .withGraphFetched('[category(selectNameIdParent), characteristics, images(selectIdAndSrc)]')
        .orderBy(`products.${sortParams.column}`, sortParams.order)
        .page(page, limit)

      return favorites
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getIds(userId: number): Promise<Favorite[] | null> {
    try {
      const ids = await Favorite.query().select(raw('GROUP_CONCAT( productId SEPARATOR "," ) as ids')).where({
        userId,
      })

      return ids
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

  // likes / dislikes

  static async deleteLike(productId: number): Promise<number | null> {
    try {
      const product = await Product.query().findOne({ id: productId })

      if (!product) {
        throw new Error("Can't find this product")
      }

      if (product.likes === 0) {
        throw new Error("Can't decrement like, because it's 0 likes")
      }

      // decrement 'likes' option in Product model
      const likes = await Product.query()
        .patch({ likes: raw('likes - 1') })
        .where({ id: productId })

      return likes
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
  static async addLike(productId: number): Promise<number | null> {
    try {
      const product = await Product.query().findOne({ id: productId })

      if (!product) {
        throw new Error("Can't find this product")
      }

      // increment 'likes' option in Product model
      const likes = await Product.query()
        .patch({ likes: raw('likes + 1') })
        .where({ id: productId })

      return likes
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteDislike(productId: number): Promise<number | null> {
    try {
      const product = await Product.query().findOne({ id: productId })

      if (!product) {
        throw new Error("Can't find this product")
      }

      if (product.dislikes === 0) {
        throw new Error("Can't decrement dislike, because it's = 0")
      }

      // decrement 'dislikes' option in Product model
      const dislikes = await Product.query()
        .patch({ dislikes: raw('dislikes - 1') })
        .where({ id: productId })

      return dislikes
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
  static async addDislike(productId: number): Promise<number | null> {
    try {
      const product = await Product.query().findOne({ id: productId })

      if (!product) {
        throw new Error("Can't find this product")
      }

      // increment 'dislikes' option in Product model
      const dislikes = await Product.query()
        .patch({ dislikes: raw('dislikes + 1') })
        .where({ id: productId })

      return dislikes
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
