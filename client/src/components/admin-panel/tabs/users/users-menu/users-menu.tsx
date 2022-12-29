import React from 'react'
import { useAppDispatch } from '../../../../../hoooks/redux'
import styles from './users-menu.module.scss'
import { FormikType } from '../../../../../models/Formik.model'
import FindMenu from '../../../../common/find-menu/find-menu'
import { fetchUsers } from '../../../../../store/slices/users/ActionCreators.users'

const UsersMenu: React.FC = () => {
  const dispatch = useAppDispatch()

  type InitialValuesType = {
    name: string | null
    id: string | null
  }

  const onSubmit = (values: InitialValuesType, { setSubmitting, setStatus }: FormikType) => {
    dispatch(fetchUsers({ id: values.id, firstName: values.name, setSubmitting, setStatus }))
  }

  return (
    <div className={styles.wrapper}>
      <FindMenu onSubmit={onSubmit} />
    </div>
  )
}

export default UsersMenu