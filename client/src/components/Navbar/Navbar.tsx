import React from 'react'
import styles from './Navbar.module.scss'
import { NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <NavLink
        className={(NavData) => (NavData.isActive ? `${styles.page} ${styles.home} ${styles.home__active}` : `${styles.page} ${styles.home}`)}
        to='/home'
      ></NavLink>

      <NavLink
        className={(NavData) =>
          NavData.isActive ? `${styles.page} ${styles.favorites} ${styles.favorites__active}` : `${styles.page} ${styles.favorites}`
        }
        to='/favorites'
      ></NavLink>

      <NavLink
        className={(NavData) =>
          NavData.isActive ? `${styles.page} ${styles.categories} ${styles.categories__active}` : `${styles.page} ${styles.categories}`
        }
        to='/products'
      ></NavLink>
    </div>
  )
}

export default Navbar
