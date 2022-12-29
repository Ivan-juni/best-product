import { ErrorMessage, Field, Form, Formik } from 'formik'
import React from 'react'
import styles from './find-menu.module.scss'
import { FormikType } from '../../../models/Formik.model'
import * as Yup from 'yup'

type InitialValuesType = {
  name: string | null
  id: string | null
}

type PropsType = {
  onSubmit: (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => void
}

const FindMenu: React.FC<PropsType> = ({ onSubmit }) => {
  const initialValues: InitialValuesType = {
    name: '',
    id: '',
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name should be longer than 2 symbols')
      .max(40, 'Name should be shorter than 40 symbols')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
    id: Yup.string()
      .min(1, 'ID should be at least 1 symbol')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .nullable(true)
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
  })

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className={styles.findProduct}>
                <div className={styles.name}>
                  <div className={styles.formControl}>
                    <span>Name</span>
                    <div className={styles.error}>
                      <ErrorMessage name='name' />
                    </div>
                    <Field
                      type='text'
                      name='name'
                      placeholder='Enter name'
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          formik.submitForm()
                        }
                      }}
                    />
                  </div>
                </div>
                <div className={styles.id}>
                  <div className={styles.formControl}>
                    <span>ID</span>
                    <div className={styles.error}>
                      <ErrorMessage name='id' />
                    </div>
                    <Field
                      type='text'
                      name='id'
                      placeholder='Enter id'
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          formik.submitForm()
                        }
                      }}
                    />
                  </div>
                </div>
                <button className={styles.find} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  Find
                </button>
                <div className={styles.status}>{formik.status}</div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default FindMenu
