import React from 'react'
import styles from './ProductLong.module.scss'
import { ReactComponent as FavoriteEmptyIcon } from '../../../assets/icons/favorites/fav-unadded-icon.svg'
import { ReactComponent as FavoriteFilledIcon } from '../../../assets/icons/favorites/fav-added-icon.svg'
import { ReactComponent as PriceIcon } from '../../../assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from '../../../assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from '../../../assets/icons/stats/favorite-stats-icon.svg'
import productImage from '../../../assets/images/JBLT110.png'

const ProductLong: React.FC = () => {
  return (
    <div className={styles.card__tall}>
      <div className={styles.main}>
        <div className={styles.favorite__section}>
          <FavoriteEmptyIcon />
        </div>
        <div className={styles.image}>
          <img src={productImage} alt='product-image' />
        </div>
        <div className={styles.info}>
          <h1 className={styles.title}>JBL T110</h1>
          <div className={styles.additional__info}>
            <p>
              <span>Purpose: </span>
              Listening music
            </p>
            <p>
              <span>Connection type: </span>
              combined, 3.5 mm, Bluetooth v 5.0
            </p>
          </div>
          <div className={styles.price}>
            <PriceIcon />
            <span>$1000</span>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.item}>
            <ViewsIcon />
            <span>1000</span>
          </div>
          <div className={styles.item}>
            <FavoriteIcon />
            <span>1000</span>
          </div>
          <div className={styles.item}>
            <LikeIcon />
            <span>1000</span>
          </div>
          <div className={styles.item}>
            <DislikeIcon />
            <span>1000</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductLong
