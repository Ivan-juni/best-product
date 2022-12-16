import React from 'react'
import styles from './AddCategory.module.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { FormikType } from '../../../../../models/Formik.model'
import { addCategory } from '../../../../../store/slices/categories/ActionCreators.categories'

const AddProductForm = () => {
  const dispatch = useAppDispatch()

  const { allCategories: categories } = useAppSelector((state) => state.categoriesReducer)

  const initialValues = {
    name: '',
    parent: categories.length > 0 ? `${categories[0].id}` : '',
  }

  type InitialValuesType = {
    name: string
    parent: string
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(addCategory({ setSubmitting, setStatus, name: values.name, parent: +values.parent }))
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name should be longer than 2 symbols').required('Required filed'),
    parent: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Required field')
      .nullable(false),
  })

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className={styles.fields}>
                <FormControl name={'name'} />
                <div className={styles.formControl}>
                  <span>Parent: </span>
                  <Field as='select' name='parent'>
                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                    })}
                  </Field>
                  <div className={styles.error}>
                    <ErrorMessage name='parent' className={styles.error} />
                  </div>
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.changeInfo} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Add category'}
                </button>
              </div>
              <div className={styles.status}>{formik.status}</div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

type FormControlProps = {
  name: string
}

const FormControl: React.FC<FormControlProps> = ({ name }) => {
  return (
    <div className={styles.formControl}>
      <span>{name.charAt(0).toLocaleUpperCase() + name.slice(1)}</span>
      <Field type='text' name={name} />
      <div className={styles.error}>
        <ErrorMessage name={name} className={styles.error} />
      </div>
    </div>
  )
}

export default AddProductForm
