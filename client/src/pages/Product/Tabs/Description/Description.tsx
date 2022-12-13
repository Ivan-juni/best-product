import React from 'react'
import { useAppDispatch } from '../../../../hoooks/redux'
import { IProduct } from '../../../../models/IProduct.model'
import styles from './Description.module.scss'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Description: React.FC<PropsType> = ({ product, isEditMode }) => {
  const dispatch = useAppDispatch()

  return (
    <div className={styles.wrapper}>
      {product && product.characteristics.hasOwnProperty('description') && (
        <p className={styles.description}>{product.characteristics.description}</p>
      )}
    </div>
  )
}

export default Description
