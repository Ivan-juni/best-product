import React from 'react'
import styles from './Home.module.scss'
import mainBannerImage from '../../assets/images/main-banner.png'
import phonesBannerImage from '../../assets/images/smartphones-category-banner.png'
import laptopsBannerImage from '../../assets/images/laptops-category-banner.png'
import booksBannerImage from '../../assets/images/books-category-banner.png'
import sportBannerImage from '../../assets/images/sport-category-banner.png'
import travelBannerImage from '../../assets/images/travel-category-banner.png'

const Home: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.banners}>
        <div className={`${styles.main__banner} ${styles.first__floor}`}>
          <img src={mainBannerImage} alt='main-banner' className={styles.thumb} />
        </div>
        <div className={styles.second__floor}>
          <div className={styles.phones__banner}>
            <img src={phonesBannerImage} alt='main-banner' className={styles.thumb} />
          </div>
          <div className={styles.laptops__banner}>
            <img src={laptopsBannerImage} alt='main-banner' className={styles.thumb} />
          </div>
        </div>
        <div className={styles.third__floor}>
          <div className={styles.books__banner}>
            <img src={booksBannerImage} alt='books-banner' className={styles.thumb} />
          </div>
          <div className={styles.sport__banner}>
            <img src={sportBannerImage} alt='sport-banner' className={styles.thumb} />
          </div>
          <div className={styles.travel__banner}>
            <img src={travelBannerImage} alt='travel-banner' className={styles.thumb} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
