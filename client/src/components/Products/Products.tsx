import React from 'react'
import styles from './Products.module.scss'
import ProductLong from './product-long/ProductLong'
import ProductShort from './product-short/ProductShort'
import ProductsMenu from './products-menu/ProductsMenu'

const Products: React.FC = () => {
  return (
    <>
      <ProductsMenu />
      <div className={styles.cards}>
        <ProductShort />
        {/* <ProductLong /> */}
      </div>
    </>
  )
}

export default Products
