import React from 'react'
import styles from './preloader.module.scss'
import preloader from 'assets/icons/other/preloader.gif'

const Preloader: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <img src={preloader} alt='preloader' />
    </div>
  )
}

export default Preloader
