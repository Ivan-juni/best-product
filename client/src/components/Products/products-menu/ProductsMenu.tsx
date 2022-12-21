import React, { useEffect, useState } from 'react'
import styles from './ProductsMenu.module.scss'
import { ReactComponent as ViewChangeCardsIcon } from '../../../assets/icons/filters/view-change-cards-icon.svg'
import { ReactComponent as ViewChangeBlockIcon } from '../../../assets/icons/filters/view-change-block-icon.svg'
import { ReactComponent as SortIcon } from '../../../assets/icons/filters/sort-icon.svg'
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/other/arrows/white-arrow-top.svg'
import { ReactComponent as FiltersIcon } from '../../../assets/icons/filters/filter-icon.svg'
import Dropdown from './Dropdown/Dropdown'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useSearchParams } from 'react-router-dom'

type PropsType = {
  setCardType: ActionCreatorWithPayload<boolean, 'favorites/setFavoritesCardType'> | ActionCreatorWithPayload<boolean, 'product/setProductsCardType'>
  cardType: boolean
}

const ProductsMenu: React.FC<PropsType> = ({ cardType, setCardType }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [params, setParams] = useState<Object>({})

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isSort, setSort] = useState(false)

  useEffect(() => {
    searchParams.forEach((key, value) => {
      if (value === 'orderByPrice') {
        if (key === 'high') {
          setSort(false)
        } else {
          setSort(true)
        }
      }
    })

    setParams(Object.fromEntries(searchParams.entries()))
  }, [searchParams])

  const sortClickHandler = () => {
    if (isSort) {
      searchParams.set('orderByPrice', 'high')
    } else {
      searchParams.set('orderByPrice', 'low')
    }
    setSearchParams(searchParams)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <button className={styles.view__change} onClick={() => setCardType(!cardType)}>
          {cardType ? <ViewChangeBlockIcon /> : <ViewChangeCardsIcon />}
        </button>
        <button className={styles.sort} onClick={sortClickHandler}>
          <SortIcon />
          <div className={styles.text}>
            <span>Price</span>
            <ArrowUpIcon className={isSort ? `${styles.arrowUp}` : `${styles.arrowDown}`} />
          </div>
        </button>
        <button className={styles.set__filters} onClick={() => setSidebarOpen((prev) => !prev)}>
          <FiltersIcon />
        </button>
        {params &&
          Object.entries(params).map((entry) => {
            if (!['limit', 'page', 'orderByPrice', 'orderByFavoriteStars'].includes(entry[0])) {
              return (
                <div className={styles.filter} key={entry[1]}>
                  <span className={styles.type}>{entry[0].charAt(0).toLocaleUpperCase() + entry[0].slice(1)}:</span>
                  <span className={styles.text}>{entry[1]}</span>
                </div>
              )
            }
          })}
      </div>
      {isSidebarOpen && (
        <div className={styles.sidebar}>
          <div className={styles.categories}>
            <Dropdown title='Categories' type='radio' items={['Headphones', 'Laptops', 'TV']} />
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
