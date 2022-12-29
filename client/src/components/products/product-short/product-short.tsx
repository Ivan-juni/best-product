import React from 'react'
import styles from './product-short.module.scss'
import { ReactComponent as FavoriteEmptyIcon } from 'assets/icons/favorites/fav-unadded-icon.svg'
import { ReactComponent as FavoriteFilledIcon } from 'assets/icons/favorites/fav-added-icon.svg'
import { ReactComponent as PriceIcon } from 'assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from 'assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from 'assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from 'assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from 'assets/icons/stats/favorite-stats-icon.svg'
import productImage from 'assets/images/JBLT110.png'
import { IProduct } from 'models/product.model'
import { useActions, useAppDispatch, useAppSelector } from 'hooks/redux'
import { addToFavorites, deleteFromFavorites } from 'store/slices/favorites/favorites.action-creators'
import { useNavigate } from 'react-router-dom'
import { showProductHandler } from 'utils/show-product-handler'
import { getFavoritesState } from 'store/slices/favorites/favorites.selectors'

type PropsType = {
  product: IProduct
}

const ProductShort: React.FC<PropsType> = ({ product }) => {
  const dispatch = useAppDispatch()
  const { ids: favorites } = useAppSelector(getFavoritesState)
  const isFavorite: boolean = favorites.some((id) => id === product.id)

  const navigate = useNavigate()
  const { setProductId } = useActions()

  const favoriteAddHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch(addToFavorites({ id: product.id }))
  }

  const favoriteDeleteHandler = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch(deleteFromFavorites({ id: product.id }))
  }

  return (
    <div className={styles.card__short}>
      <div className={styles.main} onClick={() => showProductHandler(product.id, navigate, setProductId)}>
        <div
          className={isFavorite ? `${styles.favorite__section} ${styles.filled}` : `${styles.favorite__section} ${styles.empty}`}
          onClick={(e) => e.stopPropagation()}
        >
          {isFavorite ? (
            <FavoriteFilledIcon onClick={(e) => favoriteDeleteHandler(e)} />
          ) : (
            <FavoriteEmptyIcon onClick={(e) => favoriteAddHandler(e)} />
          )}
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>
            <PriceIcon />
            <span>${product.price}</span>
          </div>
        </div>
        <div className={styles.image}>
          <img src={product.image ? product.image : productImage} alt='product' />
        </div>
        <div className={styles.stats}>
          <div className={styles.left}>
            <div className={styles.item}>
              <ViewsIcon />
              <span>{product.views}</span>
            </div>
            <div className={styles.item}>
              <FavoriteIcon />
              <span>{product.favoriteStars}</span>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.item}>
              <LikeIcon />
              <span>{product.likes}</span>
            </div>
            <div className={styles.item}>
              <DislikeIcon />
              <span>{product.dislikes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductShort
