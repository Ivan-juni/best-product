import React from 'react'
import { useAppDispatch } from '../../../../../hoooks/redux'
import styles from './products-menu.module.scss'
import { FormikType } from '../../../../../models/Formik.model'
import FindMenu from '../../../../common/find-menu/find-menu'
import { fetchProducts } from '../../../../../store/slices/product/ActionCreators.product'

const ProductsMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    const { id, ...rest } = values

    dispatch(fetchProducts({ id: values.id ? +values.id : null, setSubmitting, setStatus, ...rest }))
  }

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default ProductsMenu
