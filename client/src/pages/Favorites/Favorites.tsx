import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Preloader from '../../components/common/preloader/preloader'
import ProductsComponent from '../../components/Products/ProductsComponent'
import { withAuthRedirect } from '../../hoc/withAuthRedirect.hoc'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { fetchFavorites, fetchFavoritesIds } from '../../store/slices/favorites/ActionCreators.favorites'
import { fetchMenuInfo } from '../../store/slices/product/ActionCreators.product'
import styles from './Favorites.module.scss'

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const params: {
    [index: string]: string
  } = {}

  const { favorites, isLoading, cardType, page, total, limit } = useAppSelector((state) => state.favoritesReducer)

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
