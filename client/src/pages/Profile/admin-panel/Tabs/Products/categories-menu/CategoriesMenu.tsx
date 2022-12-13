import React from 'react'
import { useAppDispatch } from '../../../../../../hoooks/redux'
import styles from './CategoriesMenu.module.scss'
import { FormikType } from '../../../../../../models/Formik.model'
import FindMenu from '../../../../../../components/Common/find-menu/FindMenu'

const CategoriesMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {}

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default CategoriesMenu
