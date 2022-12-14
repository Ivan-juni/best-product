import React from 'react'
import styles from './Characteristics.module.scss'
import { IProduct } from '../../../../models/IProduct.model'
import { Field, ErrorMessage } from 'formik'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Characteristics: React.FC<PropsType> = ({ product, isEditMode }) => {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.items}>
        {product.characteristics &&
          Object.entries(product.characteristics).map((entry) => {
            if (entry[0] !== 'id' && entry[0] !== 'description' && entry[0] !== 'createdAt' && entry[0] !== 'updatedAt') {
              return (
                <li className={styles.item} key={entry[0]}>
                  <span className={styles.property}>{entry[0].charAt(0).toLocaleUpperCase() + entry[0].slice(1)}: </span>
                  {isEditMode ? (
                    <div className={styles.formControl}>
                      <div className={styles.error}>
                        <ErrorMessage name={`${entry[0]}`} className={styles.error} />
                      </div>
                      <Field type='text' name={`${entry[0]}`} />
                    </div>
                  ) : (
                    <span className={styles.value}>{entry[1] ? (entry[0] === 'microphone' ? 'built-in' : entry[1]) : 'none'}</span>
                  )}
                </li>
              )
            }
          })}
      </ul>
    </div>
  )
}

export default Characteristics
