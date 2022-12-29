import { useEffect } from 'react'
import styles from './home.module.scss'
import mainBannerImage from 'assets/images/main-banner.png'
import phonesBannerImage from 'assets/images/smartphones-category-banner.png'
import laptopsBannerImage from 'assets/images/laptops-category-banner.png'
import booksBannerImage from 'assets/images/books-category-banner.png'
import sportBannerImage from 'assets/images/sport-category-banner.png'
import travelBannerImage from 'assets/images/travel-category-banner.png'
import { NavLink } from 'react-router-dom'
import { useActions } from 'hooks/redux'

const Home: React.FC = () => {
  const { setProducts } = useActions()

  useEffect(() => {
    setProducts({ results: [], categories: [], total: 0 })
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.banners}>
        <div className={`${styles.main__banner} ${styles.first__floor}`}>
          <img src={mainBannerImage} alt='main-banner' className={styles.thumb} />
        </div>
        <div className={styles.second__floor}>
          <div className={styles.phones__banner}>
            <NavLink to={'/products?category=Smartphones'}>
              <img src={phonesBannerImage} alt='phones-banner' className={styles.thumb} />
            </NavLink>
          </div>
          <div className={styles.laptops__banner}>
            <NavLink to={'/products?category=Laptops'}>
              <img src={laptopsBannerImage} alt='laptops-banner' className={styles.thumb} />
            </NavLink>
          </div>
        </div>
        <div className={styles.third__floor}>
          <div className={styles.books__banner}>
            <NavLink to={'/products?category=Books'}>
              <img src={booksBannerImage} alt='books-banner' className={styles.thumb} />
            </NavLink>
          </div>
          <div className={styles.sport__banner}>
            <NavLink to={'/products?category=Sport'}>
              <img src={sportBannerImage} alt='sport-banner' className={styles.thumb} />
            </NavLink>
          </div>
          <div className={styles.travel__banner}>
            <NavLink to={'/products?category=Travel'}>
              <img src={travelBannerImage} alt='travel-banner' className={styles.thumb} />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
