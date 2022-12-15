import React, { useEffect, useState } from 'react'
import styles from './AddProductForm.module.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../../../hoooks/redux'
import { FormikType } from '../../../../../../models/Formik.model'
import { FormikCharacteristics } from '../../../../../../models/ICharacteristics'
import { useNavigate } from 'react-router-dom'
import { addProduct } from '../../../../../../store/slices/product/ActionCreators.product'

const AddProductForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [addedProductId, setProductId] = useState(0)

  const { categories } = useAppSelector((state) => state.categoriesReducer)
  const { productId } = useAppSelector((state) => state.productReducer)

  useEffect(() => {
    setProductId(productId)
  }, [productId])

  const initialValues = {
    name: '',
    price: '', // then convert to number (on submit)
    image: '',
    categoryId: categories.length > 0 ? `${categories[0].id}` : '',
    purpose: '',
    description: '',
    design: '',
    connectionType: '',
    microphone: '', // then convert to boolean (on submit)
    batteryLiveTime: '', // then convert to number (on submit)
    display: '',
  }

  type InitialValuesType = {
    name: string
    price: string
    categoryId: string
    image: File | string
  } & FormikCharacteristics

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    const { price, categoryId, batteryLiveTime, microphone, ...rest } = values
    dispatch(
      addProduct({
        setStatus,
        setSubmitting,
        price: +values.price,
        categoryId: +values.categoryId,
        batteryLiveTime: +values.batteryLiveTime,
        microphone: values.microphone === 'true' ? true : false,
        ...rest,
      })
    )
    if (addedProductId !== 0) {
      navigate(`/product?productId=${addedProductId}`)
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(4, 'Name should be longer than 3 symbols').required('Required filed'),
    price: Yup.string()
      .min(2, 'Price should be longer than 1 symbols')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Required field')
      .nullable(false),
    purpose: Yup.string().min(4, 'Purpose should be longer than 3 symbols').nullable(false).required('Required field'),
    description: Yup.string().min(10, 'Description should be longer than 10 symbols').nullable(false).required('Required field'),
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
    microphone: Yup.string()
      .transform((_, value: string) => {
        return value === '' || value === 'null' || value === '0' || value === 'false' || value === 'none' ? 'false' : 'true'
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
    categoryId: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .required('Required field'),
    image: Yup.mixed().required('Image is required').nullable(false),
  })

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <div className={styles.fields}>
                <div className={styles.left}>
                  <FormControl name={'name'} />
                  <div className={styles.formControl}>
                    <span>{fileName !== '' ? `Image: (${fileName})` : 'Image: '}</span>
                    <Field
                      type='file'
                      id='image'
                      name='image'
                      hidden
                      value={undefined}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.currentTarget.files) {
                          formik.setFieldValue('image', e.currentTarget.files[0])
                          setFileName(e.currentTarget.files[0].name)
                        }
                      }}
                      className={styles.fileUpload}
                    />
                    <label htmlFor='image'>Choose image</label>
                    <div className={styles.error}>
                      <ErrorMessage name='image' className={styles.error} />
                    </div>
                  </div>
                  <div className={styles.formControl}>
                    <span>Category: </span>
                    <Field as='select' name='categoryId'>
                      {categories.map((category) => {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        )
                      })}
                    </Field>
                    <div className={styles.error}>
                      <ErrorMessage name='categoryId' className={styles.error} />
                    </div>
                  </div>
                  <div className={styles.formControl}>
                    <span>Description</span>
                    <Field as='textarea' name={'description'} />
                    <div className={styles.error}>
                      <ErrorMessage name={'description'} className={styles.error} />
                    </div>
                  </div>
                </div>
                <div className={styles.right}>
                  <FormControl name={'price'} />
                  <FormControl name={'purpose'} />
                  <FormControl name={'design'} />
                  <FormControl name={'connectionType'} />
                  <FormControl name={'microphone'} />
                  <FormControl name={'batteryLiveTime'} />
                  <FormControl name={'display'} />
                </div>
              </div>
              <div className={styles.submit}>
                <button className={styles.changeInfo} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : 'Add product'}
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
