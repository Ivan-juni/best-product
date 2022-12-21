import React from 'react'
import styles from './ProductShort.module.scss'
import { ReactComponent as FavoriteEmptyIcon } from '../../../assets/icons/favorites/fav-unadded-icon.svg'
import { ReactComponent as FavoriteFilledIcon } from '../../../assets/icons/favorites/fav-added-icon.svg'
import { ReactComponent as PriceIcon } from '../../../assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from '../../../assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from '../../../assets/icons/stats/favorite-stats-icon.svg'
import productImage from '../../../assets/images/JBLT110.png'
import { IProduct } from '../../../models/IProduct.model'
import { useActions, useAppDispatch, useAppSelector } from '../../../hoooks/redux'
import { addToFavorites, deleteFromFavorites } from '../../../store/slices/favorites/ActionCreators.favorites'
import { useNavigate } from 'react-router-dom'
import { showProductHandler } from '../../../utils/showProductHandler'

type PropsType = {
  product: IProduct
}

const ProductShort: React.FC<PropsType> = ({ product }) => {
  const dispatch = useAppDispatch()
  const { ids: favorites } = useAppSelector((state) => state.favoritesReducer)
  const isFavorite = favorites.some((id) => id === product.id)

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
            <FavoriteFilledIcon onClick={(e) => favoriteAddHandler(e)} />
          ) : (
            <FavoriteEmptyIcon onClick={(e) => favoriteDeleteHandler(e)} />
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
