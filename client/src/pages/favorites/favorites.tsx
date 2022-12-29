import { useEffect } from 'react'
import styles from './favorites.module.scss'
import { useSearchParams } from 'react-router-dom'
import Preloader from 'components/common/preloader/preloader'
import ProductsComponent from 'components/products/products-component'
import { withAuthRedirect } from 'hoc/with-auth-redirect.hoc'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { fetchFavorites, fetchFavoritesIds } from 'store/slices/favorites/favorites.action-creators'
import { fetchMenuInfo } from 'store/slices/product/product.action-creators'
import { getFavoritesState } from 'store/slices/favorites/favorites.selectors'

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const params: {
    [index: string]: string
  } = {}

  const { favorites, isLoading, cardType, page, total, limit } = useAppSelector(getFavoritesState)

  const { setFavoritesCardType, setFavoritesPage } = useActions()

  useEffect(() => {
    searchParams.set('page', `${page}`)
    searchParams.set('limit', `${9}`)
    setSearchParams(searchParams)

    searchParams.forEach((key, value) => {
      params[value] = key
    })

    dispatch(fetchFavorites(params))
    dispatch(fetchMenuInfo(params))
    dispatch(fetchFavoritesIds())
  }, [page, searchParams])

  return (
    <div className={styles.wrapper}>
      {isLoading && favorites.length > 0 ? (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      ) : (
        <ProductsComponent
          products={favorites}
          page={page}
          total={total}
          limit={limit}
          isLoading={isLoading}
          cardType={cardType}
          setPage={setFavoritesPage}
          setCardType={setFavoritesCardType}
        />
      )}
    </div>
  )
}

export default withAuthRedirect(Favorites)
