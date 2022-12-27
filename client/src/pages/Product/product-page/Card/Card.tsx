import React, { useEffect } from 'react'
import styles from './Card.module.scss'
import { ReactComponent as PriceIcon } from '../../../../assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from '../../../../assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from '../../../../assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from '../../../../assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from '../../../../assets/icons/stats/favorite-stats-icon.svg'
import { IProduct } from '../../../../models/IProduct.model'
import ImagesSlider from '../../../../components/Common/Slider/Slider'
import { Field, ErrorMessage, Form, Formik } from 'formik'
import { FormikType } from '../../../../models/Formik.model'
import * as Yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../../hoooks/redux'
import {
  addDislike,
  addLike,
  addToFavorites,
  addView,
  deleteDislike,
  deleteFromFavorites,
  deleteLike,
  fetchFavoritesIds,
} from '../../../../store/slices/favorites/ActionCreators.favorites'
import { editProduct, fetchProducts } from '../../../../store/slices/product/ActionCreators.product'
import { fetchCategories } from '../../../../store/slices/categories/ActionCreators.categories'

type PropsType = {
  product: IProduct
  isEditMode: boolean
  changeMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  addImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  deleteImage: (imageId: number) => void
}

const Card: React.FC<PropsType> = ({ product, isEditMode, changeMainImage, addImage, deleteImage }) => {
  const dispatch = useAppDispatch()
  const { isAuth } = useAppSelector((state) => state.authReducer)
  const { allCategories: categories } = useAppSelector((state) => state.categoriesReducer)
  const { likes, dislikes, views, ids: favorites } = useAppSelector((state) => state.favoritesReducer)

  const isLiked = likes.some((id) => id === product.id)
  const isDisliked = dislikes.some((id) => id === product.id)
  const isViewed = views.some((id) => id === product.id)
  const isFavorite = favorites.some((id) => id === product.id)

  const likeHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (!isLiked) {
      dispatch(addLike({ id: product.id }))
    } else {
      dispatch(deleteLike({ id: product.id }))
    }
  }

  const dislikeHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    console.log(isDisliked)

    if (!isDisliked) {
      dispatch(addDislike({ id: product.id }))
    } else {
      dispatch(deleteDislike({ id: product.id }))
    }
  }

  const favoriteHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (!isFavorite) {
      dispatch(addToFavorites({ id: product.id }))
    } else {
      dispatch(deleteFromFavorites({ id: product.id }))
    }
  }

  useEffect(() => {
    if (!isViewed) {
      dispatch(addView({ id: product.id }))
    }
    dispatch(fetchCategories({}))
  }, [])

  useEffect(() => {
    dispatch(fetchProducts({ id: product.id }))
  }, [views, likes, dislikes])

  useEffect(() => {
    dispatch(fetchProducts({ id: product.id }))
    dispatch(fetchFavoritesIds())
  }, [isFavorite])

  const initialValues = {
    name: product ? product.name : '',
    price: product ? `${product.price}` : '', // then convert to number (on submit)
    categoryId: (product ? product.category : '') ? `${product.category.id}` : '',
  }

  const onSubmit = (values: typeof initialValues, { setSubmitting, setStatus }: FormikType) => {
    dispatch(
      editProduct({
        setStatus,
        setSubmitting,
        id: product.id,
        price: values.price ? +values.price : product.price,
        categoryId: values.categoryId ? +values.categoryId : product.category.id,
      })
    )
  }

  const validationSchema = Yup.object({
    name: Yup.string().min(4, 'Name should be longer than 3 symbols'),
    price: Yup.string()
      .min(2, 'Price should be longer than 1 symbols')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .nullable(false),
    categoryId: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .transform((_, value: string) => {
        return value === '' ? null : value
      }),
  })

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
            <div className={styles.wrapper}>
              <section className={styles.slider}>
                <ImagesSlider
                  product={product}
                  isEditMode={isEditMode}
                  changeMainImage={changeMainImage}
                  addImage={addImage}
                  deleteImage={deleteImage}
                />
              </section>
              {product && product.characteristics && (
                <section className={styles.info}>
                  <div className={styles.up}>
                    <div className={styles.stats}>
                      <div className={styles.item}>
                        <ViewsIcon />
                        <span>{product.views}</span>
                      </div>
                      <div className={styles.item}>
                        <button
                          type='button'
                          onClick={(e) => favoriteHandler(e)}
                          className={isFavorite ? styles.disabled : styles.button}
                          disabled={!isAuth}
                        >
                          <FavoriteIcon />
                        </button>
                        <span>{product.favoriteStars}</span>
                      </div>
                      <div className={styles.item}>
                        <button
                          type='button'
                          onClick={(e) => likeHandler(e)}
                          className={isLiked ? styles.disabled : styles.button}
                          disabled={!isAuth || isDisliked}
                        >
                          <LikeIcon />
                        </button>
                        <span>{product.likes}</span>
                      </div>
                      <div className={styles.item}>
                        <button
                          type='button'
                          onClick={(e) => dislikeHandler(e)}
                          className={isDisliked ? styles.disabled : styles.button}
                          disabled={!isAuth || isLiked}
                        >
                          <DislikeIcon />
                        </button>
                        <span>{product.dislikes}</span>
                      </div>
                    </div>
                    <div className={styles.text}>
                      <h1 className={styles.title}>
                        {isEditMode ? (
                          <div className={styles.formControl}>
                            <div className={styles.error}>
                              <ErrorMessage name='name' className={styles.error} />
                            </div>
                            <Field type='text' name='name' />
                          </div>
                        ) : (
                          product.name
                        )}
                      </h1>
                      <div className={styles.additional}>
                        <p>
                          <span>Purpose: </span>
                          {product.characteristics.purpose}
                        </p>
                        {product.characteristics.connectionType && (
                          <p>
                            <span>Connection type: </span>
                            {product.characteristics.connectionType}
                          </p>
                        )}
                        <p>
                          {isEditMode ? (
                            <span className={styles.formControl}>
                              <span className={styles.error}>
                                <ErrorMessage name='categoryId' className={styles.error} />
                              </span>
                              <span className={styles.categorySelect}>
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
                              </span>
                            </span>
                          ) : (
                            <>
                              <span>Category: </span>
                              {product.category.name}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.down}>
                    <div className={styles.price}>
                      <PriceIcon />
                      {isEditMode ? (
                        <div className={styles.formControl}>
                          <Field type='text' name='price' />
                          <div className={styles.error}>
                            <ErrorMessage name='price' className={styles.error} />
                          </div>
                        </div>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </div>
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
                </section>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Card
