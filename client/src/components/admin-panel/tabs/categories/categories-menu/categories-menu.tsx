import React from 'react'
import { useAppDispatch } from '../../../../../hoooks/redux'
import styles from './categories-menu.module.scss'
import { FormikType } from '../../../../../models/Formik.model'
import FindMenu from '../../../../common/find-menu/find-menu'
import { fetchCategories } from '../../../../../store/slices/categories/ActionCreators.categories'

const CategoriesMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(fetchCategories({ setSubmitting, setStatus, id: values.id ? +values.id : null, name: values.name ? values.name : null }))
  }

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default CategoriesMenu