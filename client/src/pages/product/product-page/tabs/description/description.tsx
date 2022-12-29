import React from 'react'
import styles from './description.module.scss'
import { IProduct } from 'models/product.model'
import { Field, ErrorMessage, Formik, Form } from 'formik'
import * as Yup from 'yup'
import { FormikType } from 'models/formik.model'
import { editProduct } from 'store/slices/product/product.action-creators'
import { useAppDispatch } from 'hooks/redux'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Description: React.FC<PropsType> = ({ product, isEditMode }) => {
  const dispatch = useAppDispatch()

  const initialValues = {
    description: (product ? product.characteristics : '') ? product.characteristics.description : '',
  }

  const onSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: FormikType) => {
    dispatch(
      editProduct({
        setStatus,
        setSubmitting,
        id: product.id,
        ...values,
      })
    )
  }

  const validationSchema = Yup.object({
    description: Yup.string().min(10, 'Description should be longer than 10 symbols').nullable(false),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
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

export default Description
