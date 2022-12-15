import React from 'react'
import CategoriesMenu from './categories-menu/CategoriesMenu'
import styles from './CategoriesTab.module.scss'

const CategoriesTab: React.FC = () => {
  return (
    <section className={styles.categories}>
      <h2>Categories</h2>
      <div className={styles.body}>
        <CategoriesMenu />
      </div>
    </section>
  )
}

export default CategoriesTab
