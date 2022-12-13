import React, { useEffect } from 'react'
import styles from './Product.module.scss'
import Card from './Card/Card'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { IProduct } from '../../models/IProduct.model'
import { fetchProducts } from '../../store/slices/product/ActionCreators.product'
import { useSearchParams } from 'react-router-dom'

const Product: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products, isEditMode, productId } = useAppSelector((state) => state.productReducer)
  // для подгрузки продукта при перезагрузке страницы
  const [searchParams, setSearchParams] = useSearchParams()
  const { setProductId } = useActions()

  const filteredProduct = products.filter((product: IProduct) => product.id === productId)

  useEffect(() => {
    if (!productId || productId === 0) {
      const id = searchParams.get('productId')
      if (id) {
        dispatch(fetchProducts({ id: `${id}` }))
        setProductId(+id)
      }
    }
  }, [productId])

  return <div className={styles.wrapper}>{filteredProduct.length !== 0 && <Card product={filteredProduct[0]} isEditMode={isEditMode} />}</div>
}

export default Product
