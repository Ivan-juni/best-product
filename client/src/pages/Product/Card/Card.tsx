import React from 'react'
import styles from './Card.module.scss'
import { ReactComponent as PriceIcon } from '../../../assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from '../../../assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from '../../../assets/icons/stats/favorite-stats-icon.svg'
import { IProduct } from '../../../models/IProduct.model'
import ImagesSlider from '../../../components/Common/Slider/Slider'
import { Field, ErrorMessage } from 'formik'
import { useAppSelector } from '../../../hoooks/redux'

type PropsType = {
  product: IProduct
  isEditMode: boolean
  changeMainImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  addImage: (e: React.ChangeEvent<HTMLInputElement>) => void
  deleteImage: (imageId: number) => void
}

const Card: React.FC<PropsType> = ({ product, isEditMode, changeMainImage, addImage, deleteImage }) => {
  const { allCategories: categories } = useAppSelector((state) => state.categoriesReducer)

  return (
    <div className={styles.wrapper}>
      <section className={styles.slider}>
        <ImagesSlider product={product} isEditMode={isEditMode} changeMainImage={changeMainImage} addImage={addImage} deleteImage={deleteImage} />
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
                <FavoriteIcon />
                <span>{product.favoriteStars}</span>
              </div>
              <div className={styles.item}>
                <LikeIcon />
                <span>{product.likes}</span>
              </div>
              <div className={styles.item}>
                <DislikeIcon />
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
          </div>
        </section>
      )}
    </div>
  )
}

export default Card
