import { useEffect } from 'react'
import styles from './product-container.module.scss'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { fetchPriceDynamics, fetchProduct } from 'store/slices/product/product.action-creators'
import { useSearchParams } from 'react-router-dom'
import { fetchComments } from 'store/slices/comments/comments.action-creators'
import ProductPage from './product-page/product-page'
import GoToTop from 'utils/go-to-top'
import { getProductState } from 'store/slices/product/product.selectors'
import { getCommentsState } from 'store/slices/comments/comments.selectors'

const ProductContainer: React.FC = () => {
  const dispatch = useAppDispatch()

  const { isEditMode, productId } = useAppSelector(getProductState)
  const { page, total } = useAppSelector(getCommentsState)

  // для подгрузки продукта при перезагрузке страницы
  const [searchParams, setSearchParams] = useSearchParams()

  const { setProductId } = useActions()

  useEffect(() => {
    if (productId !== 0) dispatch(fetchComments({ productId, page: page }))
  }, [page, total])

  useEffect(() => {
    if (productId !== 0) dispatch(fetchComments({ productId }))
    dispatch(fetchPriceDynamics({ productId }))
    if (!productId || productId === 0) {
      const id = searchParams.get('productId')
      if (id) {
        dispatch(fetchProduct({ id: +id }))
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
