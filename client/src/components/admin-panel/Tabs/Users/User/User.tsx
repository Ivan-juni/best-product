import React from 'react'
import styles from './User.module.scss'
import userAvatar from '../../../../../assets/images/unknown-user.png'
import { IUser } from '../../../../../models/IUser.model'
import { useAppDispatch, useAppSelector } from '../../../../../hoooks/redux'
import { ReactComponent as DeleteUserIcon } from '../../../../../assets/icons/other/delete-icon.svg'
import { changeRole, deleteUser } from '../../../../../store/slices/users/ActionCreators.users'

type PropsType = {
  user: IUser
}

const User: React.FC<PropsType> = ({ user }) => {
  const dispatch = useAppDispatch()
  const yourId = useAppSelector((state) => state.authReducer.user.id)

  const deleteClickHandler = () => {
    dispatch(deleteUser({ id: user.id }))
  }

  const changeRoleHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'ADMIN' || e.target.value === 'USER') {
      dispatch(changeRole({ id: user.id, role: e.target.value }))
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.photo}>
        <img src={user.photo ? user.photo : userAvatar} alt='avatar' />
        <div className={styles.menu}>
          <ul>
            <li>
              <select name='role' id='role' defaultValue={user.role} disabled={user.id === yourId} onChange={changeRoleHandler}>
                <option value='USER'>USER</option>
                <option value='ADMIN'>ADMIN</option>
              </select>
            </li>
            <li>
              <button className={styles.deleteButton} disabled={user.id === yourId || user.role === 'ADMIN'} onClick={deleteClickHandler}>
                <DeleteUserIcon />
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.info}>
        <ul className={styles.name}>
          <li>
            <span>Firstname:</span> <span>{user.firstName}</span>
          </li>
          <li>
            <span>Lastname:</span> <span>{user.lastName}</span>
          </li>
        </ul>
        <ul className={styles.email}>
          <li>
            <span>Email: </span>
            <span id={styles.email__span}>{user.email}</span>
          </li>
          <li>
            <span>
              <span id={styles.text}>ID:</span> <span id={styles.id}>{user.id}</span>
            </span>
            {user.id === yourId && <span id={styles.you}>You</span>}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default User
