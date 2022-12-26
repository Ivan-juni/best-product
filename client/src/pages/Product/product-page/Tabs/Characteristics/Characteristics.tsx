import React from 'react'
import styles from './Characteristics.module.scss'
import { IProduct } from '../../../../../models/IProduct.model'
import { Field, ErrorMessage, FormikProps } from 'formik'

type PropsType = {
  product: IProduct
  isEditMode: boolean
  formik: FormikProps<{
    name: string
    price: string
    categoryId: string
    purpose: string
    description: string
    design: string
    connectionType: string
    microphone: boolean
    batteryLiveTime: string
    display: string
  }>
}

const Characteristics: React.FC<PropsType> = ({ product, isEditMode, formik }) => {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.items}>
        {product.characteristics &&
          Object.entries(product.characteristics).map((entry) => {
            if (!['id', 'description', 'createdAt', 'updatedAt', 'microphone'].includes(entry[0])) {
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
                    <span className={styles.value}>{entry[1] ? entry[1] : 'none'}</span>
                  )}
                </li>
              )
            } else if (entry[0] === 'microphone') {
              return (
                <li className={styles.item} key={entry[0]}>
                  <span className={styles.property}>{entry[0].charAt(0).toLocaleUpperCase() + entry[0].slice(1)}: </span>
                  {isEditMode ? (
                    <div className={styles.formControl}>
                      <div className={styles.error}>
                        <ErrorMessage name={`${entry[0]}`} className={styles.error} />
                      </div>
                      <input
                        className={styles.checkbox}
                        type='checkbox'
                        name={`${entry[0]}`}
                        id={`${entry[0]}`}
                        onChange={formik.handleChange}
                        onReset={formik.handleReset}
                        defaultChecked={formik.values.microphone}
                      />
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
