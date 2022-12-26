import React, { useEffect } from 'react'
import styles from './ProductContainer.module.scss'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { fetchPriceDynamics, fetchProducts } from '../../store/slices/product/ActionCreators.product'
import { useSearchParams } from 'react-router-dom'
import { fetchComments } from '../../store/slices/comments/ActionCreators.comments'
import ProductPage from './product-page/ProductPage'
import GoToTop from '../../utils/go-to-top'

const ProductContainer: React.FC = () => {
  const dispatch = useAppDispatch()

  const { isEditMode, productId } = useAppSelector((state) => state.productReducer)
  const { page, total } = useAppSelector((state) => state.commentsReducer)

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
      {<ProductPage />}
      {/* auto scroll to top after redirecting */}
      <GoToTop />
    </div>
  )
}

export default ProductContainer
