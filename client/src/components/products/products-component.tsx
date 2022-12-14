import styles from './products.module.scss'
import ProductLong from './product-long/product-long'
import ProductShort from './product-short/product-short'
import ProductsMenu from './products-menu/products-menu'
import { IProduct } from 'models/product.model'
import Preloader from '../common/preloader/preloader'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import Paginator from '../common/paginator/paginator'

type PropsType = {
  products: IProduct[]
  page: number
  total: number
  limit?: number
  isLoading: boolean
  setPage: ActionCreatorWithPayload<number, 'favorites/setFavoritesPage'> | ActionCreatorWithPayload<number, 'product/setProductsPage'>
  setCardType: ActionCreatorWithPayload<boolean, 'favorites/setFavoritesCardType'> | ActionCreatorWithPayload<boolean, 'product/setProductsCardType'>
  cardType: boolean
}

const ProductsComponent: React.FC<PropsType> = ({ products, isLoading, page, total, cardType, setPage, setCardType, limit }) => {
  return (
    <>
      <ProductsMenu cardType={cardType} setCardType={setCardType} />
      {!isLoading ? (
        <div className={styles.cards}>
          {products.length > 0 ? (
            products.map((product) => {
              return cardType ? <ProductShort key={product.id} product={product} /> : <ProductLong key={product.id} product={product} />
            })
          ) : (
            <div className={styles.noItems}>
              <h1>No products here...</h1>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.loading}>
          <Preloader />
        </div>
      )}
      <div className={styles.pagination}>
        <Paginator total={total} page={page} setPage={setPage} limit={limit ? limit : 9} />
      </div>
    </>
  )
}

export default ProductsComponent
