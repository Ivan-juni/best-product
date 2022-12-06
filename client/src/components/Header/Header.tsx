import React from 'react'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../../assets/icons/logo-main.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/other/search-icon.svg'
import userAvatar from '../../assets/images/unknown-user.png'
import withoutPhotoUserAvatar from '../../assets/images/without-photo-user.png'
import Auth from './Auth/Auth'
import LoginModal from '../Modals/login-modal/LoginModal'
import RegistrationModal from '../Modals/registration-modal/RegistrationModal'
import { useAppSelector } from '../../hoooks/redux'
import Preloader from '../Common/Preloader/Preloader'

type PropsType = {
  authOpen: boolean
  setAuthOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<PropsType> = ({ authOpen, setAuthOpen }) => {
  const { user, isAuth, isLoading, isLogModalOpen, isRegModalOpen } = useAppSelector((state) => state.authReducer)

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
          <input type='text' className={styles.search__input} placeholder='Search' />
        </div>
        <div className={styles.auth} onClick={(e) => e.stopPropagation()}>
          {isLoading ? (
            <Preloader />
          ) : (
            <img
              src={isAuth ? (user.photo ? user.photo : withoutPhotoUserAvatar) : userAvatar}
              alt='avatar'
              className={authOpen ? styles.auth__avatar + ' ' + styles.active : styles.auth__avatar}
              onClick={() => setAuthOpen((prev) => !prev)}
            />
          )}
          {authOpen && <Auth setAuthOpen={setAuthOpen} isAuth={isAuth} user={user} />}
        </div>
      </div>
      {isLogModalOpen && <LoginModal />}
      {isRegModalOpen && <RegistrationModal />}
    </>
  )
}

export default Header
