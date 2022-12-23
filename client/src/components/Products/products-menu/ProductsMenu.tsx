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
import { useAppDispatch, useAppSelector } from '../../../hoooks/redux'
import { fetchCategories } from '../../../store/slices/categories/ActionCreators.categories'
import Price from './Dropdown/Price/Price'
import { fetchMenuInfo } from '../../../store/slices/product/ActionCreators.product'

type PropsType = {
  setCardType: ActionCreatorWithPayload<boolean, 'favorites/setFavoritesCardType'> | ActionCreatorWithPayload<boolean, 'product/setProductsCardType'>
  cardType: boolean
}

const ProductsMenu: React.FC<PropsType> = ({ cardType, setCardType }) => {
  const dispatch = useAppDispatch()
  const { allCategories: categories } = useAppSelector((state) => state.categoriesReducer)
  const { menuInfo } = useAppSelector((state) => state.productReducer)

  const [searchParams, setSearchParams] = useSearchParams()
  const [params, setParams] = useState<Object>({})

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isSort, setSort] = useState(false)
  const [isReset, setReset] = useState(false)

  useEffect(() => {
    dispatch(fetchCategories({}))

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
  }, [searchParams, isReset])

  const sortClickHandler = () => {
    if (isSort) {
      searchParams.set('orderByPrice', 'high')
    } else {
      searchParams.set('orderByPrice', 'low')
    }
    setSearchParams(searchParams)
  }

  const handleResetClick = () => {
    setSearchParams({ page: '0', limit: '9' })
    setReset(true)
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
            <Dropdown
              isReset={isReset}
              setReset={setReset}
              title='Categories'
              type='radio'
              items={[...categories.map((category) => category.name)]}
            />
          </div>
          <Price priceRange={menuInfo.price[0] !== 'null' ? menuInfo.price : ['0', '0']} isReset={isReset} setReset={setReset} />
          <div className={styles.connection__method}>
            <Dropdown
              isReset={isReset}
              setReset={setReset}
              title='Connection method'
              type='checkbox'
              items={[...menuInfo.connectionType.map((value) => value)].filter((val, i, a) => a.indexOf(val) === i)}
            />
          </div>
          <div className={styles.purpose}>
            <Dropdown
              isReset={isReset}
              setReset={setReset}
              title='Purpose'
              type='checkbox'
              items={[...menuInfo.purpose.map((value) => value)].filter((val, i, a) => a.indexOf(val) === i)}
            />
          </div>
          <div className={styles.microphone}>
            <Dropdown isReset={isReset} setReset={setReset} title='Microphone' type='radio' items={['built-in', 'none']} />
          </div>
          <div className={styles.display}>
            <Dropdown
              isReset={isReset}
              setReset={setReset}
              title='Display'
              type='checkbox'
              items={[...menuInfo.display.map((value) => value)].filter((val, i, a) => a.indexOf(val) === i)}
            />
          </div>
          <div className={styles.reset}>
            <button onClick={handleResetClick} disabled={Object.keys(params).length <= 2}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsMenu
