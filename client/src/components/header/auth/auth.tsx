import React from 'react'
import styles from './auth.module.scss'
import { NavLink } from 'react-router-dom'
import { IUser } from 'models/user.model'
import { useActions, useAppDispatch } from 'hooks/redux'
import { logout } from 'store/slices/auth/auth.action-creators'

type PropsType = {
  setAuthOpen: React.Dispatch<React.SetStateAction<boolean>>
  isAuth: boolean
  user: IUser
}

const Auth: React.FC<PropsType> = ({ setAuthOpen, isAuth, user }) => {
  const dispatch = useAppDispatch()
  const { setLogModalOpen } = useActions()

  const loginClick = () => {
    setLogModalOpen(true)
    setAuthOpen(false)
  }

  const logoutClick = () => {
    dispatch(logout())
    setAuthOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      {isAuth ? (
        <>
          <div className={styles.name__section}>
            <NavLink className={styles.link} to='/profile' onClick={() => setAuthOpen(false)}>
              <span className={styles.text}>{user.firstName + ' ' + user.lastName}</span>
            </NavLink>
          </div>

          <div className={styles.link__section}>
            <span className={styles.text} onClick={logoutClick}>
              Log out
            </span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.name__section}>
            <span className={styles.text}>Unknown user</span>
          </div>
          <div className={styles.link__section}>
            <span className={styles.text} onClick={loginClick}>
              Log in
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default Auth
