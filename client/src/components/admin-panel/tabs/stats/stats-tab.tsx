import React, { useEffect } from 'react'
import Preloader from 'components/common/preloader/preloader'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { fetchStats } from 'store/slices/product/product.action-creators'
import styles from './stats-tab.module.scss'
import MostTable from './tables/most-table'
import { getProductStats } from 'store/slices/product/product.selectors'

const StatsTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const stats = useAppSelector(getProductStats)

  useEffect(() => {
    dispatch(fetchStats({ quantity: 15 }))
  }, [])

  return (
    <section className={styles.stats}>
      <h2>Stats</h2>
      <div className={styles.body}>
        {Object.keys(stats).length > 0 ? (
          <>
            <div className={styles.table}>
              <h3>Most viewed</h3>
              <MostTable stats={stats} options={{ statisticOption: 'topViews', statProperty: 'views', columnName: 'Views' }} />
            </div>
            <div className={styles.table}>
              <h3>Most favorites</h3>
              <MostTable
                stats={stats}
                options={{ statisticOption: 'topFavoriteStars', statProperty: 'favoriteStars', columnName: 'Favorite stars' }}
              />
            </div>
            <div className={styles.table}>
              <h3>Most liked</h3>
              <MostTable stats={stats} options={{ statisticOption: 'topLikes', statProperty: 'likes', columnName: 'Likes' }} />
            </div>
          </>
        ) : (
          <div className={styles.preloader}>
            <Preloader />
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsTab
