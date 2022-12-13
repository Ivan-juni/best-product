import React from 'react'
import styles from './Card.module.scss'
import { ReactComponent as PriceIcon } from '../../../assets/icons/other/price-icon.svg'
import { ReactComponent as ViewsIcon } from '../../../assets/icons/stats/views-stats-icon.svg'
import { ReactComponent as LikeIcon } from '../../../assets/icons/stats/like-stats-icon.svg'
import { ReactComponent as DislikeIcon } from '../../../assets/icons/stats/dislike-stats-icon.svg'
import { ReactComponent as FavoriteIcon } from '../../../assets/icons/stats/favorite-stats-icon.svg'
import { IProduct } from '../../../models/IProduct.model'
import ImagesSlider from '../../../components/Common/Slider/Slider'

type PropsType = {
  product: IProduct
  isEditMode: boolean
}

const Card: React.FC<PropsType> = ({ product, isEditMode }) => {
  return (
    <div className={styles.wrapper}>
      <section className={styles.slider}>
        <ImagesSlider product={product} />
      </section>
      <section className={styles.info}>
        <div className={styles.up}>
          <div className={styles.stats}>
            <div className={styles.item}>
              <ViewsIcon />
              <span>{product.views}</span>
            </div>
            <div className={styles.item}>
              <FavoriteIcon />
              <span>{product.favoriteStars}</span>
            </div>
            <div className={styles.item}>
              <LikeIcon />
              <span>{product.likes}</span>
            </div>
            <div className={styles.item}>
              <DislikeIcon />
              <span>{product.dislikes}</span>
            </div>
          </div>
          <div className={styles.text}>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.additional}>
              <p>
                <span>Purpose: </span>
                {product.characteristics.purpose}
              </p>
              <p>
                <span>Connection type: </span>
                {product.characteristics.connectionType}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.price}>
            <PriceIcon />
            <span>${product.price}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Card
