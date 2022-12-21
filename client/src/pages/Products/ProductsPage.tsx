import React, { useEffect } from 'react'
import styles from './ProductsPage.module.scss'
import Preloader from '../../components/Common/Preloader/Preloader'
import ProductsComponent from '../../components/Products/ProductsComponent'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { fetchProducts } from '../../store/slices/product/ActionCreators.product'
import { Breadcrumbs, Typography } from '@mui/material'
import { ReactComponent as BreadcrumbIcon } from '../../assets/icons/other/arrows/purple-arrow-right.svg'
import { useSearchParams } from 'react-router-dom'
import { fetchFavoritesIds } from '../../store/slices/favorites/ActionCreators.favorites'
import GoToTop from '../../utils/GoToTop'

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const params: {
    [index: string]: string
  } = {}

  const { products, parentCategories, isLoading, cardType, page, limit, total } = useAppSelector((state) => state.productReducer)

  const { setProductsCardType, setProductsPage, setLimit } = useActions()

  useEffect(() => {
    setLimit(9)
    searchParams.set('page', `${page}`)
    searchParams.set('limit', `${limit}`)
    setSearchParams(searchParams)

    searchParams.forEach((key, value) => {
      params[value] = key
    })

    dispatch(fetchProducts(params))
    dispatch(fetchFavoritesIds())
  }, [page, searchParams])

  function handleBreadcrumbClick(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.preventDefault()
    if (e.currentTarget.textContent) {
      searchParams.set('category', e.currentTarget.textContent)
      setSearchParams(searchParams)
    }
  }

  const breadcrumbs = [
    parentCategories.length > 0 &&
      parentCategories.map((category, index) => {
        if (index === parentCategories.length - 1) {
          const link = (
            <Typography key={index + 1} color='#000000'>
              {category.name}
            </Typography>
          )
          return link
        } else {
          const link = (
            <span key={index + 1} onClick={(e) => handleBreadcrumbClick(e)} className={styles.breadcrumb}>
              {category.name}
            </span>
          )
          return link
        }
      }),
  ]

  return (
    <div className={styles.wrapper}>
      {searchParams.get('category') && (
        <div className={styles.breadcrumbs}>
          <Breadcrumbs separator={<BreadcrumbIcon className={styles.icon} />} aria-label='breadcrumb'>
            {breadcrumbs}
          </Breadcrumbs>
        </div>
      )}
      {!isLoading && products && products.length > 0 ? (
        <ProductsComponent
          products={products}
          setPage={setProductsPage}
          page={page}
          total={total}
          limit={limit}
          isLoading={isLoading}
          cardType={cardType}
          setCardType={setProductsCardType}
        />
      ) : (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      )}
      {/* auto scroll to top after redirecting */}
      <GoToTop />
    </div>
  )
}

export default ProductsPage
