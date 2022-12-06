import React, { useState } from 'react'
import styles from './Products.module.scss'
import ProductLong from './product-long/ProductLong'
import ProductShort from './product-short/ProductShort'
import ProductsMenu from './products-menu/ProductsMenu'

const Products: React.FC = () => {
  const [cardType, setCardType] = useState(false)
  // change with redux?
  const [isFavorite, setFavorite] = useState(false)

  return (
    <>
      <ProductsMenu cardType={cardType} setCardType={setCardType} />
      <div className={styles.cards}>
        {cardType ? (
          <ProductShort isFavorite={isFavorite} setFavorite={setFavorite} />
        ) : (
          <ProductLong isFavorite={isFavorite} setFavorite={setFavorite} />
        )}
      </div>
    </>
  )
}

export default Products
