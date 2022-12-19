import React, { useEffect, useRef, useState } from 'react'
import styles from './Product.module.scss'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { fetchPriceDynamics, fetchProducts } from '../../store/slices/product/ActionCreators.product'
import { useSearchParams } from 'react-router-dom'
import Preloader from '../../components/Common/Preloader/Preloader'
import { fetchComments } from '../../store/slices/comments/ActionCreators.comments'
import { Portal } from '@mui/material'
import AddCommentForm from './Tabs/Comments/add-comment/AddCommentForm'
import UpdateProductForm from './update-product-form/UpdateProductForm'

const Product: React.FC = () => {
  const dispatch = useAppDispatch()

  // для рендера формы добавления комментария в CommentsTab
  const portalAddRef = useRef(null)
  const [isRef, setRef] = useState(false)

  const { isEditMode, productId } = useAppSelector((state) => state.productReducer)
  const { page, total, isLoading } = useAppSelector((state) => state.commentsReducer)

  // для подгрузки продукта при перезагрузке страницы
  const [searchParams, setSearchParams] = useSearchParams()

  const { setProductId } = useActions()

  useEffect(() => {
    dispatch(fetchComments({ productId, page: page }))
  }, [page, total])

  useEffect(() => {
    dispatch(fetchComments({ productId }))
    dispatch(fetchPriceDynamics({ productId }))
    if (!productId || productId === 0) {
      const id = searchParams.get('productId')
      if (id) {
        dispatch(fetchProducts({ id: `${id}` }))
        setProductId(+id)
      }
    }
  }, [productId, isEditMode])

  return (
    <div className={styles.wrapper}>
      {<UpdateProductForm setRef={setRef} portalAddRef={portalAddRef} />}
      {portalAddRef.current && (
        <Portal container={portalAddRef.current}>
          <AddCommentForm productId={productId} />
        </Portal>
      )}
    </div>
  )
}

export default Product
