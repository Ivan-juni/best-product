import React from 'react'
import styles from './Characteristics.module.scss'
import { IProduct } from '../../../../../models/IProduct.model'
import { Field, ErrorMessage, Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch } from '../../../../../hoooks/redux'
import { editProduct } from '../../../../../store/slices/product/ActionCreators.product'
import { FormikType } from '../../../../../models/Formik.model'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Characteristics: React.FC<PropsType> = ({ product, isEditMode }) => {
  const dispatch = useAppDispatch()

  const initialValues = {
    purpose: (product ? product.characteristics : '') ? product.characteristics.purpose : '',
    design: (product ? product.characteristics : '') ? `${product.characteristics.design}` : '',
    connectionType: (product ? product.characteristics : '') ? `${product.characteristics.connectionType}` : '',
    microphone: (product ? product.characteristics : false) ? (product.characteristics.microphone == true ? true : false) : false,
    batteryLiveTime: (product ? product.characteristics : '') ? `${product.characteristics.batteryLiveTime}` : '', // then convert to number (on submit)
    display: (product ? product.characteristics : '') ? `${product.characteristics.display}` : '',
  }

  type InitialValuesType = {
    purpose: string | null
    design: string | null
    connectionType: string | null
    microphone: boolean
    batteryLiveTime: string | null
    display: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    const { batteryLiveTime, ...rest } = values

    dispatch(
      editProduct({
        setStatus,
        setSubmitting,
        id: product.id,
        batteryLiveTime: values.batteryLiveTime ? +values.batteryLiveTime : product.characteristics.batteryLiveTime,
        ...rest,
      })
    )
  }

  const validationSchema = Yup.object({
    purpose: Yup.string().min(4, 'Purpose should be longer than 3 symbols').nullable(false),
    design: Yup.string()
      .transform((_, value: string) => {
        return value === '' || value === 'null' ? null : value
      })
      .nullable(true),
    connectionType: Yup.string()
      .transform((_, value: string) => {
        return value === '' || value === 'null' ? null : value
      })
      .nullable(true),
    batteryLiveTime: Yup.string()
      .transform((_, value: string) => {
        return value === '' || value === 'null' ? null : value
      })
      .nullable(true),
    display: Yup.string()
      .transform((_, value: string) => {
        return value === '' || value === 'null' ? null : value
      })
      .nullable(true),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
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
              {isEditMode && (
                <div className={styles.submit}>
                  <button className={styles.changeInfo} type='submit' disabled={!formik.isValid || formik.isSubmitting}>
                    {formik.isSubmitting ? 'Please wait...' : 'Save'}
                  </button>
                  <button className={styles.cancel} type={'reset'}>
                    Cancel
                  </button>
                  <div className={styles.status}>{formik.status}</div>
                </div>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Characteristics
