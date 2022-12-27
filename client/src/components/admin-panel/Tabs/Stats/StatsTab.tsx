import React, { useEffect } from 'react'
import Preloader from '../../../Common/Preloader/Preloader'
import { useAppDispatch, useAppSelector } from '../../../../hoooks/redux'
import { fetchStats } from '../../../../store/slices/product/ActionCreators.product'
import styles from './StatsTab.module.scss'
import MostTable from './Tables/MostTable'

const StatsTab: React.FC = () => {
  const dispatch = useAppDispatch()
  const { stats } = useAppSelector((state) => state.productReducer)

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
