import React from 'react'
import styles from './product-page.module.scss'
import Card from './card/card'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { IProduct } from 'models/product.model'
import { addImage, deleteImage, editProduct } from 'store/slices/product/product.action-creators'
import { useNavigate } from 'react-router-dom'
import ProductTabs from './tabs/product-tabs'
import { ReactComponent as EditIcon } from 'assets/icons/other/edit-icon.svg'
import Preloader from 'components/common/preloader/preloader'
import { getUser } from 'store/slices/auth/auth.selectors'
import { getProductState } from 'store/slices/product/product.selectors'
import { ROLES } from 'models/user.model'

const ProductPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const { products, priceDynamics, isEditMode, productId } = useAppSelector(getProductState)
  const { role } = useAppSelector(getUser)

  // для кнопки "go back"
  const navigate = useNavigate()

  const { setEditMode } = useActions()

  const filteredProduct: IProduct[] = products.filter((product: IProduct) => product.id === productId)
  const product: IProduct = filteredProduct[0]

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
      {role === ROLES.ADMIN && (
        <div className={styles.menu}>
          <div className={styles.left} onClick={() => navigate(-1)}>
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='currentColor' viewBox='0 0 16 16'>
              <path
                fillRule='evenodd'
                d='M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z'
              />
            </svg>
          </div>
          <div className={styles.right}>
            <button className={styles.edit} onClick={(e) => editClickHandler(e)}>
              <EditIcon />
            </button>
          </div>
        </div>
      )}
      <div className={styles.main}>
        {filteredProduct.length !== 0 ? (
          <>
            <Card
              product={product}
              isEditMode={isEditMode}
              changeMainImage={changeMainImageHandler}
              addImage={addImageHandler}
              deleteImage={deleteImageHandler}
            />
            <ProductTabs product={product} isEditMode={isEditMode} productId={productId} priceDynamics={priceDynamics} />
          </>
        ) : (
          <Preloader />
        )}
      </div>
    </div>
  )
}

export default ProductPage
