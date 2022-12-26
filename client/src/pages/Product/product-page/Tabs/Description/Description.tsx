import React from 'react'
import styles from './Description.module.scss'
import { IProduct } from '../../../../../models/IProduct.model'
import { Field, ErrorMessage } from 'formik'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Description: React.FC<PropsType> = ({ product, isEditMode }) => {
  return (
    <div className={styles.wrapper}>
      {product && product.characteristics && product.characteristics.hasOwnProperty('description') && isEditMode ? (
        <div className={styles.formControl}>
          <div className={styles.error}>
            <ErrorMessage name='description' className={styles.error} />
          </div>
          <Field as='textarea' name='description' />
        </div>
      ) : (
        product &&
        product.characteristics &&
        product.characteristics.hasOwnProperty('description') && <p className={styles.description}>{product.characteristics.description}</p>
      )}
    </div>
  )
}

export default Description
