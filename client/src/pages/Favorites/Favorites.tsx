import React, { useEffect } from 'react'
import Preloader from '../../components/Common/Preloader/Preloader'
import Products from '../../components/Products/Products'
import { withAuthRedirect } from '../../hoc/withAuthRedirect.hoc'
import { useActions, useAppDispatch, useAppSelector } from '../../hoooks/redux'
import { fetchFavorites, fetchFavoritesIds } from '../../store/slices/favorites/ActionCreators.favorites'
import styles from './Favorites.module.scss'

const Favorites: React.FC = () => {
  const dispatch = useAppDispatch()
  const { favorites, isLoading, cardType, page, total } = useAppSelector((state) => state.favoritesReducer)
  const { setFavoritesCardType } = useActions()

  useEffect(() => {
    dispatch(fetchFavorites({ page: `${page}` }))
    dispatch(fetchFavoritesIds())
  }, [page])

  return (
    <div className={styles.wrapper}>
      {isLoading && favorites.length > 0 ? (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      ) : (
        <Products products={favorites} page={page} total={total} isLoading={isLoading} cardType={cardType} setCardType={setFavoritesCardType} />
      )}
    </div>
  )
}

export default withAuthRedirect(Favorites)
