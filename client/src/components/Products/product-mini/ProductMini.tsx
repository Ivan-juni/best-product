import React from 'react'
import styles from './ProductMini.module.scss'
import { IProduct } from '../../../models/IProduct.model'

type PropsType = {
  product: IProduct
}

const ProductMini: React.FC<PropsType> = ({ product }) => {
  return (
    <div className={styles.card__mini}>
      <div className={styles.main}>
        <div className={styles.image}>
          <img src={product.image} alt='product' />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
        </div>
      </div>
    </div>
  )
}

export default ProductMini
