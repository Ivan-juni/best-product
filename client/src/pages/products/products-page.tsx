import { useEffect } from 'react'
import styles from './products-page.module.scss'
import ProductsComponent from 'components/products/products-component'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { fetchMenuInfo, fetchProducts } from 'store/slices/product/product.action-creators'
import { Breadcrumbs, Typography } from '@mui/material'
import { ReactComponent as BreadcrumbIcon } from 'assets/icons/other/arrows/purple-arrow-right.svg'
import { useSearchParams } from 'react-router-dom'
import { fetchFavoritesIds } from 'store/slices/favorites/favorites.action-creators'
import GoToTop from 'utils/go-to-top'
import { getProductState } from 'store/slices/product/product.selectors'

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const params: {
    [index: string]: string
  } = {}

  const { products, parentCategories, isLoading, cardType, page: productsPage, limit, total } = useAppSelector(getProductState)

  const { setProductsCardType, setProductsPage } = useActions()

  useEffect(() => {
    searchParams.set('page', `${productsPage}`)
    searchParams.set('limit', `${9}`)
    setSearchParams(searchParams)

    searchParams.forEach((key, value) => {
      params[value] = key
    })

    const { limit, page, ...rest } = params

    dispatch(fetchProducts({ limit: +limit, page: +page, ...rest }))
    dispatch(fetchMenuInfo({ limit: +limit, page: +page, ...rest }))
    dispatch(fetchFavoritesIds())
  }, [productsPage, searchParams])

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
      <ProductsComponent
        products={products}
        setPage={setProductsPage}
        page={productsPage}
        total={total}
        limit={limit}
        isLoading={isLoading}
        cardType={cardType}
        setCardType={setProductsCardType}
      />

      {/* auto scroll to top after redirecting */}
      <GoToTop />
    </div>
  )
}

export default ProductsPage
