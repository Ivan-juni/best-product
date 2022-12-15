import React, { useEffect } from 'react'
import styles from './Product.module.scss'
import Card from './Card/Card'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { IProduct } from '../../models/IProduct.model'
import { addImage, deleteImage, editProduct, fetchProducts } from '../../store/slices/product/ActionCreators.product'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductTabs from './Tabs/ProductTabs'
import { ReactComponent as EditIcon } from '../../assets/icons/other/edit-icon.svg'
import { Form, Formik } from 'formik'
import { FormikType } from '../../models/Formik.model'
import * as Yup from 'yup'
import { FormikCharacteristics } from '../../models/ICharacteristics'
import Preloader from '../../components/Common/Preloader/Preloader'
import { fetchCategories } from '../../store/slices/categories/ActionCreators.categories'

const Product: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products, isEditMode, productId, isLoading } = useAppSelector((state) => state.productReducer)
  const { role } = useAppSelector((state) => state.authReducer.user)

  // для подгрузки продукта при перезагрузке страницы
  const [searchParams, setSearchParams] = useSearchParams()

  // для кнопки "go back"
  const navigate = useNavigate()

  const { setProductId, setEditMode } = useActions()

  const filteredProduct = products.filter((product: IProduct) => product.id === productId)
  const product = filteredProduct[0]

  useEffect(() => {
    dispatch(fetchCategories({}))
    if (!productId || productId === 0) {
      const id = searchParams.get('productId')
      if (id) {
        dispatch(fetchProducts({ id: `${id}` }))
        setProductId(+id)
      }
    }
  }, [productId, isEditMode])

  const initialValues = {
    name: product ? product.name : '',
    price: product ? `${product.price}` : '', // then convert to number (on submit)
    categoryId: (product ? product.category : '') ? `${product.category.id}` : '',
    purpose: (product ? product.characteristics : '') ? product.characteristics.purpose : '',
    description: (product ? product.characteristics : '') ? product.characteristics.description : '',
    design: (product ? product.characteristics : '') ? `${product.characteristics.design}` : '',
    connectionType: (product ? product.characteristics : '') ? `${product.characteristics.connectionType}` : '',
    microphone: (product ? product.characteristics : '') ? `${product.characteristics.microphone}` : '', // then convert to boolean (on submit)
    batteryLiveTime: (product ? product.characteristics : '') ? `${product.characteristics.batteryLiveTime}` : '', // then convert to number (on submit)
    display: (product ? product.characteristics : '') ? `${product.characteristics.display}` : '',
  }

  type InitialValuesType = {
    name: string
    price: string
    categoryId: string
  } & FormikCharacteristics

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    const { price, categoryId, batteryLiveTime, microphone, ...rest } = values

    dispatch(
      editProduct({
        setStatus,
        setSubmitting,
        id: product.id,
        price: values.price ? +values.price : product.price,
        categoryId: values.categoryId ? +values.categoryId : product.category.id,
        batteryLiveTime: values.batteryLiveTime ? +values.batteryLiveTime : product.characteristics.batteryLiveTime,
        microphone: values.microphone === 'true' ? true : false,
        ...rest,
      })
    )

    dispatch(setEditMode(false))
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(4, 'Name should be longer than 3 symbols'),
    price: Yup.string()
      .min(2, 'Price should be longer than 1 symbols')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .nullable(false),
    purpose: Yup.string().min(4, 'Purpose should be longer than 3 symbols').nullable(false),
    description: Yup.string().min(10, 'Description should be longer than 10 symbols').nullable(false),
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
        return value === '' || value === 'null' || value === '0' || value === 'false' ? 'false' : 'true'
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
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
  })

  const editClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setEditMode(!isEditMode)
  }

  const changeMainImageHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      if (e.target.files.length === 1) {
        dispatch(editProduct({ id: product.id, image: e.target.files[0] }))
      }
    }
  }

  const addImageHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        const files = Array.from(e.target.files)

        dispatch(addImage({ id: product.id, images: files }))
      }
    }
  }

  const deleteImageHandler = (imageId: number): void => {
    dispatch(deleteImage({ productId: product.id, imageId }))
  }

  return (
    <div className={styles.wrapper}>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              {role === 'ADMIN' && (
                <div className={styles.menu}>
                  <div className={styles.left} onClick={() => navigate(-1)}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' viewBox='0 0 16 16'>
                      <path
                        fillRule='evenodd'
                        d='M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z'
                      />
                    </svg>
                  </div>
                  {isEditMode ? (
                    <div className={styles.right}>
                      <div className={styles.submit}>
                        <button className={styles.changeInfo} type={'submit'} disabled={!formik.isValid || formik.isSubmitting}>
                          {formik.isSubmitting ? 'Please wait...' : 'Save All'}
                        </button>
                        <button className={styles.cancel} type={'reset'} onClick={() => setEditMode(false)}>
                          Cancel
                        </button>
                        <div className={styles.status}>{formik.status}</div>
                      </div>
                      <button className={styles.edit} onClick={(e) => editClickHandler(e)}>
                        <EditIcon />
                      </button>
                    </div>
                  ) : (
                    <div className={styles.right}>
                      <button className={styles.edit} onClick={(e) => editClickHandler(e)}>
                        <EditIcon />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className={styles.main}>
                {!isLoading ? (
                  filteredProduct.length !== 0 && (
                    <Card
                      product={product}
                      isEditMode={isEditMode}
                      changeMainImage={changeMainImageHandler}
                      addImage={addImageHandler}
                      deleteImage={deleteImageHandler}
                    />
                  )
                ) : (
                  <Preloader />
                )}
                {!isLoading && <ProductTabs product={product} isEditMode={isEditMode} />}
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default Product
