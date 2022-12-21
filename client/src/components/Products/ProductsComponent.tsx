import React from 'react'
import styles from './Products.module.scss'
import ProductLong from './product-long/ProductLong'
import ProductShort from './product-short/ProductShort'
import ProductsMenu from './products-menu/ProductsMenu'
import { IProduct } from '../../models/IProduct.model'
import Preloader from '../Common/Preloader/Preloader'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import Paginator from '../Common/Paginator/Paginator'

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
