import React, { useEffect } from 'react'
import Preloader from '../../../../../components/Common/Preloader/Preloader'
import { useActions, useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { fetchUsers } from '../../../../../store/slices/users/ActionCreators.users'
import User from './User/User'
import styles from './UsersTab.module.scss'
import { IUser } from '../../../../../http/models/IUser.api'
import Paginator from '../../../../../components/Common/Paginator/Paginator'
import UsersMenu from './users-menu/UsersMenu'

const UsersTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading, total, page, users } = useAppSelector((state) => state.usersReducer)

  // pagination
  const { setUsersPage } = useActions()

  useEffect(() => {
    const limit = 3

    dispatch(fetchUsers({ id: null, firstName: null, page, limit }))
  }, [page])

  return (
    <div className={styles.wrapper}>
      <UsersMenu />
      <div className={isLoading ? styles.loading : styles.users}>
        {isLoading ? <Preloader /> : users.map((user: IUser) => <User key={user.id} user={user} />)}
        {users.length === 0 && !isLoading && (
          <div className={styles.noUsers}>
            <h1>No users...</h1>
          </div>
        )}
      </div>
      <div className={styles.pagination}>
        <Paginator total={total} page={page} setPage={setUsersPage} limit={3} />
      </div>
    </div>
  )
}

export default UsersTab
