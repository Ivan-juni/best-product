import Objection, { raw } from 'objection'
import Comment from '../db/models/comment/comment.model'
import Favorite from '../db/models/favorite/favorite.model'
import ProductCharacteristics from '../db/models/product-characteristics/product-characteristics.model'
import Product from '../db/models/product/product.model'
import { IProduct, IProductBody, IProductsQuery } from '../types/products.type'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery) {
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    const findInRange = (
      qb: Objection.QueryBuilder<Product, Product[]>,
      parametr: string
    ) => {
      const parametrArray = searchCriteria[parametr].split('-')

      if (parametrArray.length > 1 && parametrArray[1]) {
        // Ex: if ?parametr=400-1000
        qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0]).andWhere(
          `products.${parametr}`,
          '<=',
          +parametrArray[1]
        )
      } else if (parametrArray.length == 1 && !parametrArray[1]) {
        // Ex: if ?parametr=400
        qb.andWhere(`products.${parametr}`, '>=', +parametrArray[0])
      }
    }

    try {
      const products = await Product.query()
        .select()
        .from('products')
        .where(async (qb) => {
          if (searchCriteria.id) {
            qb.where('products.id', '=', +searchCriteria.id)
          }

          if (searchCriteria.name) {
            qb.andWhere('products.name', 'like', `%${searchCriteria.name}%`)
          }

          if (searchCriteria.purpose) {
            qb.andWhere(
              'products.purpose',
              'like',
              `%${searchCriteria.purpose}%`
            )
          }

          if (searchCriteria.price) {
            findInRange(qb, 'price')
          }

          if (searchCriteria.views) {
            findInRange(qb, 'views')
          }

          if (searchCriteria.likes) {
            findInRange(qb, 'likes')
          }

          if (searchCriteria.dislikes) {
            findInRange(qb, 'dislikes')
          }

          if (searchCriteria.favoriteStars) {
            findInRange(qb, 'favoriteStars')
          }
          // if (searchCriteria.category) {
          // }
        })
        .innerJoin('categories', 'categories.id', 'products.categoryId')
        .page(page, limit)

      return products.results
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getStatistics(quantity = 5) {
    // 5 most viewed/liked/disliked/added to favorites
    try {
      const views = await Product.query()
        .select('name', 'views')
        .orderBy('views', 'desc')
        .limit(quantity)

      const likes = await Product.query()
        .select('name', 'likes')
        .orderBy('likes', 'desc')
        .limit(quantity)

      const dislikes = await Product.query()
        .select('name', 'dislikes')
        .orderBy('dislikes', 'desc')
        .limit(quantity)

      const favoriteStars = await Product.query()
        .select('name', 'favoriteStars')
        .orderBy('favoriteStars', 'desc')
        .limit(quantity)

      return {
        topViews: views,
        topLikes: likes,
        topDislikes: dislikes,
        topFavoriteStars: favoriteStars,
      }
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getCharacteristics(productId: number) {
    try {
      const characteristics = await Product.query()
        .select(
          'products.id as productId',
          'products.name as productName',
          'product_characteristics.*'
        )
        .where('products.id', '=', productId)
        .innerJoin(
          'product_characteristics',
          'product_characteristics.id',
          'products.characteristicsId'
        )

      return characteristics
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addToFavorite(userId: number, productId: number) {
    try {
      const candidate = await Favorite.query().findOne({ userId, productId })

      if (candidate) {
        return candidate
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

  static async deleteFromFavorite(userId: number, productId: number) {
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

  static async addComment(userId: number, productId: number, text: string) {
    try {
      const comment = await Comment.query().insertAndFetch({
        userId,
        productId,
        text,
      })

      return comment
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteComment(
    userId: number,
    commentId: number
  ): Promise<
    | number
    | {
        message: string
      }
    | null
  > {
    try {
      const comment = await Comment.query().findOne({ id: commentId, userId })

      if (!comment) {
        return { message: "Can't find this comment" }
      }

      const deletedComments = await Comment.query()
        .delete()
        .where({ id: commentId, userId })

      return deletedComments
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async getProductComments(
    productId: number,
    page = 0,
    limit = 5
  ): Promise<Objection.Page<Comment>> {
    try {
      const comments = await Comment.query()
        .select(
          'comments.id',
          'comments.userId',
          'users.email as userEmail',
          'users.firstName as userFirstName',
          'users.lastName as userLastName',
          'users.photo as userPhoto',
          'comments.text',
          'comments.createdAt',
          'comments.updatedAt'
        )
        .where({ productId })
        .leftJoin('users', function () {
          this.on('users.id', '=', 'comments.userId')
        })
        .page(page, limit)

      return comments
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async deleteProduct(
    productId: number
  ): Promise<number | { message: string } | null> {
    try {
      const product = await Product.query().findById(productId)

      if (!product) {
        return { message: "Can't find this products" }
      }

      const deletedProducts = await Product.query().deleteById(productId)
      await ProductCharacteristics.query().deleteById(product.characteristicsId)

      return deletedProducts
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }

  static async addProduct(product: IProduct) {
    try {
      const characteristics = await ProductCharacteristics.query().insert({
        purpose: product.purpose,
        description: product.description,
        design: product.design,
        connectionType: product.connectionType,
        microphone: product.microphone,
        batteryLiveTime: product.batteryLiveTime,
        display: product.display,
      })

      return Product.query().insert({
        name: product.name,
        price: +product.price,
        image: product.image,
        categoryId: +product.categoryId,
        characteristicsId: +characteristics.id,
      })
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
