import React from 'react'
import styles from './Auth.module.scss'
import { NavLink } from 'react-router-dom'

type PropsType = {
  setAuthOpen: (value: React.SetStateAction<boolean>) => void
  setModalActive: (value: React.SetStateAction<boolean>) => void
}

const Auth: React.FC<PropsType> = ({ setAuthOpen, setModalActive }) => {
  const loginClick = () => {
    setModalActive(true)
    setAuthOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      {/* Make isAuth check here */}
      {false ? (
        <>
          <div className={styles.name__section}>
            <NavLink className={styles.link} to='/profile'>
              <span className={styles.text}>{'${firstName lastName}'}</span>
            </NavLink>
          </div>

          <div className={styles.link__section}>
            {/* <NavLink className={styles.link} to='/login'> */}
            <span className={styles.text}>Log out</span>
            {/* </NavLink> */}
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
