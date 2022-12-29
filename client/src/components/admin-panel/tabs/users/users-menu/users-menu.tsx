import styles from './users-menu.module.scss'
import { useAppDispatch } from 'hooks/redux'
import { FormikType } from 'models/formik.model'
import FindMenu from 'components/common/find-menu/find-menu'
import { fetchUsers } from 'store/slices/users/users.action-creators'

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
