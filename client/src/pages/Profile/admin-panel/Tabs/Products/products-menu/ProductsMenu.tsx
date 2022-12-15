import React from 'react'
import { useAppDispatch } from '../../../../../../hoooks/redux'
import styles from './ProductsMenu.module.scss'
import { FormikType } from '../../../../../../models/Formik.model'
import FindMenu from '../../../../../../components/Common/Find-menu/FindMenu'
import { fetchProducts } from '../../../../../../store/slices/product/ActionCreators.product'

const ProductsMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(fetchProducts({ ...values, setSubmitting, setStatus }))
  }

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default ProductsMenu
