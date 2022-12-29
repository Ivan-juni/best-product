import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../../assets/icons/logo-main.svg'
import userAvatar from '../../assets/images/unknown-user.png'
import withoutPhotoUserAvatar from '../../assets/images/without-photo-user.png'
import Auth from './Auth/Auth'
import LoginModal from '../Modals/login-modal/LoginModal'
import RegistrationModal from '../Modals/registration-modal/RegistrationModal'
import { useActions, useAppSelector } from '../../hoooks/redux'
import Preloader from '../common/preloader/preloader'
import Search from './Search/Search'
import SearchModal from './Search/Modal/SearchModal'

type PropsType = {
  authOpen: boolean
  setAuthOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Header: React.FC<PropsType> = ({ authOpen, setAuthOpen }) => {
  const { user, isAuth, isLoading, isNavbarOpen, isLogModalOpen, isRegModalOpen } = useAppSelector((state) => state.authReducer)
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  // burger menu
  const { setNavbarOpen } = useActions()
  const handleClick = () => {
    setNavbarOpen(!isNavbarOpen)
  }

  const closeModalHandler = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    if (isNavbarOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isNavbarOpen])

  return (
    <>
      <div className={styles.wrapper} onClick={closeModalHandler}>
        <div className={styles.logo}>
          <div className={isNavbarOpen ? `${styles.burger__button} ${styles._active}` : `${styles.burger__button}`} onClick={handleClick}>
            <span></span>
          </div>
          <NavLink className={styles.link} to='/home'>
            <LogoIcon className={styles.logo__thumb} />
            <span className={styles.text}>BEST PRODUCTS</span>
          </NavLink>
        </div>
        <div className={styles.search}>
          <Search setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
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
        <div className={isNavbarOpen ? `${styles.navbar} ${styles._active}` : `${styles.navbar}`}>
          <NavLink
            className={(NavData) => (NavData.isActive ? `${styles.page} ${styles.home} ${styles.home__active}` : `${styles.page} ${styles.home}`)}
            to='/home'
          >
            <span>Home</span>
          </NavLink>
          <NavLink
            className={(NavData) =>
              NavData.isActive ? `${styles.page} ${styles.favorites} ${styles.favorites__active}` : `${styles.page} ${styles.favorites}`
            }
            to='/favorites'
          >
            <span>Favorites</span>
          </NavLink>
          <NavLink
            className={(NavData) =>
              NavData.isActive ? `${styles.page} ${styles.categories} ${styles.categories__active}` : `${styles.page} ${styles.categories}`
            }
            to='/products'
          >
            <span>Products</span>
          </NavLink>
          <div className={styles.search}>
            <Search setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
          </div>
        </div>
      </div>
      {isLogModalOpen && <LoginModal />}
      {isRegModalOpen && <RegistrationModal />}
      {isModalOpen && <SearchModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />}
    </>
  )
}

export default Header
