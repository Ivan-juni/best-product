import React from 'react'
import Products from '../../components/Products/Products'
import styles from './Favorites.module.scss'

const Favorites: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Products />
    </div>
  )
}

export default Favorites
