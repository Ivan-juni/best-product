import React, { useState } from 'react'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../../assets/icons/logo-main.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/other/search-icon.svg'
import userAvatar from '../../assets/images/unknown-user.png'
import Auth from './Auth/Auth'
import LoginModal from '../Modals/login-modal/LoginModal'
import RegistrationModal from '../Modals/registration-modal/RegistrationModal'

const Header: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false)

  const [loginModalActive, setLoginModalActive] = useState(false)
  const [registrationModalActive, setRegistrationModalActive] = useState(false)

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <NavLink className={styles.link} to='/home'>
            <LogoIcon className={styles.logo__thumb} />
            <span className={styles.text}>BEST PRODUCTS</span>
          </NavLink>
        </div>
        <div className={styles.search}>
          <SearchIcon className={styles.search__icon} />
          <input
            type='text'
            className={styles.search__input}
            placeholder='Search'
          />
        </div>
        <div className={styles.auth}>
          <img
            src={userAvatar}
            alt='avatar'
            className={
              authOpen
                ? styles.auth__avatar + ' ' + styles.active
                : styles.auth__avatar
            }
            onClick={() => setAuthOpen((prev) => !prev)}
          />
          {authOpen && (
            <Auth
              setModalActive={setLoginModalActive}
              setAuthOpen={setAuthOpen}
            />
          )}
        </div>
      </div>
      {loginModalActive && (
        <LoginModal
          setLoginActive={setLoginModalActive}
          loginActive={loginModalActive}
          setRegistrationActive={setRegistrationModalActive}
          registrationActive={registrationModalActive}
        />
      )}
      {registrationModalActive && (
        <RegistrationModal
          setRegistrationActive={setRegistrationModalActive}
          registrationActive={registrationModalActive}
        />
      )}
    </>
  )
}

export default Header
