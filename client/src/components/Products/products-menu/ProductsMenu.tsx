import React, { useState } from 'react'
import styles from './ProductsMenu.module.scss'
import { ReactComponent as ViewChangeCardsIcon } from '../../../assets/icons/filters/view-change-cards-icon.svg'
import { ReactComponent as ViewChangeBlockIcon } from '../../../assets/icons/filters/view-change-block-icon.svg'
import { ReactComponent as SortIcon } from '../../../assets/icons/filters/sort-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/other/arrows/white-arrow-top.svg'
import { ReactComponent as FiltersIcon } from '../../../assets/icons/filters/filter-icon.svg'
import Dropdown from './Dropdown/Dropdown'

const ProductsMenu: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <button className={styles.view__change}>
          <ViewChangeCardsIcon />
        </button>
        <button className={styles.sort}>
          <SortIcon />
          <div className={styles.text}>
            <span>Price</span>
            <ArrowUpIcon />
          </div>
        </button>
        <button
          className={styles.set__filters}
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FiltersIcon />
        </button>
        <div className={styles.filter}>
          <span className={styles.type}>Category:</span>
          <span className={styles.text}>Headphones</span>
        </div>
      </div>
      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <div className={styles.categories}>
            <Dropdown
              title='Categories'
              type='radio'
              items={['Headphones', 'Laptops', 'TV']}
            />
          </div>
          <div className={styles.price}></div>
          <div className={styles.connection__method}></div>
          <div className={styles.purpose}></div>
          <div className={styles.microphone}></div>
          <div className={styles.display}></div>
        </div>
      )}
    </div>
  )
}

export default ProductsMenu
