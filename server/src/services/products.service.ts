import Product from '../db/models/product/product.model'
import { IProductsQuery } from '../types/products.type'

export default class ProductService {
  static async getProducts(searchCriteria: IProductsQuery) {
    const limit = +searchCriteria.limit || 5
    const page = +searchCriteria.page || 0

    try {
      const products = await Product.query()
        .select()
        .where((qb) => {
          if (searchCriteria.id) {
            qb.where('products.id', '=', +searchCriteria.id)
          }
        })
        .page(page, limit)

      return products.results
    } catch (error) {
      console.log('Error: ', error)
      return null
    }
  }
}
