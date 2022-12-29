import Objection, { raw } from 'objection'
import Favorite from '../db/models/favorite.model'
import Product from '../db/models/product.model'
import { findProducts } from '../utils/find-products.util'
import { sort } from '../utils/order-by.util'
import { DeleteType, IProductsQuery } from './types/products.type'

export default class FavoritesService {
  static async getFavorites(userId: number, searchCriteria: IProductsQuery): Promise<Objection.Page<Product>> {
    // пагинация
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    // параметры для сортировки
    const sortParams = sort(searchCriteria, ['price', 'favoriteStars'])
    sortParams.map((param) => {
      param.column = `products.${param.column}`
    })

    return Product.query()
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
      .orderBy(sortParams)
      .page(page, limit)
  }

  static async getIds(userId: number): Promise<Favorite[]> {
    return Favorite.query().select(raw('GROUP_CONCAT( productId SEPARATOR "," ) as ids')).where({
      userId,
    })
  }

  static async addToFavorite(userId: number, productId: number): Promise<Favorite> {
    // add to favorite and increment 'favorites' option in Product model
    await Product.query()
      .patch({ favoriteStars: raw('favoriteStars + 1') })
      .where({ id: productId })

    return Favorite.query().insertAndFetch({
      userId,
      productId,
    })
  }

  static async deleteFromFavorite(userId: number, productId: number): DeleteType {
    // delete from favorite and decrement 'favorites' option in Product model
    await Product.query()
      .patch({ favoriteStars: raw('favoriteStars - 1') })
      .where({ id: productId })

    return Favorite.query().delete().where({ userId, productId })
  }

  // likes / dislikes

  static async deleteLike(productId: number): Promise<number> {
    // decrement 'likes' option in Product model
    return Product.query()
      .patch({ likes: raw('likes - 1') })
      .where({ id: productId })
  }

  static async addLike(productId: number): Promise<number> {
    // increment 'likes' option in Product model
    return Product.query()
      .patch({ likes: raw('likes + 1') })
      .where({ id: productId })
  }

  static async deleteDislike(productId: number): Promise<number> {
    // decrement 'dislikes' option in Product model
    return Product.query()
      .patch({ dislikes: raw('dislikes - 1') })
      .where({ id: productId })
  }

  static async addDislike(productId: number): Promise<number> {
    // increment 'dislikes' option in Product model
    return Product.query()
      .patch({ dislikes: raw('dislikes + 1') })
      .where({ id: productId })
  }

  static async addView(productId: number): Promise<number> {
    // increment 'views' option in Product model
    return Product.query()
      .patch({ views: raw('views + 1') })
      .where({ id: productId })
  }
}
