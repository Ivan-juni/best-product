import React from 'react'
import styles from './Paginator.module.scss'
import { ReactComponent as LeftArrow } from '../../../assets/icons/other/arrows/purple-arrow-left.svg'
import { ReactComponent as RightArrow } from '../../../assets/icons/other/arrows/purple-arrow-right.svg'

type PropsType = {
  setPage: React.Dispatch<React.SetStateAction<number>>
  total: number
  page: number
}

const Paginator: React.FC<PropsType> = ({ page, total, setPage }) => {
  const totalPages = Math.ceil(total / 3)

  return (
    <div className={styles.wrapper}>
      <ul className={styles.items}>
        <li className={page + 1 === 1 ? styles.disabled : styles.item} onClick={() => setPage((prev) => (prev < 1 ? prev : prev - 1))}>
          <LeftArrow />
        </li>
        <li className={styles.item}>{page + 1}</li>
        <li className={styles.item}>/</li>
        <li className={styles.item}>{totalPages}</li>
        <li
          className={page + 1 === totalPages ? styles.disabled : styles.item}
          onClick={() => setPage((prev) => (prev === totalPages - 1 ? prev : prev + 1))}
        >
          <RightArrow />
        </li>
      </ul>
    </div>
  )
}

export default Paginator
