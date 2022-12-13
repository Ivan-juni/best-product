import React from 'react'
// import styles from './Paginator.module.scss'
// import { ReactComponent as LeftArrow } from '../../../assets/icons/other/arrows/purple-arrow-left.svg'
// import { ReactComponent as RightArrow } from '../../../assets/icons/other/arrows/purple-arrow-right.svg'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

type PropsType = {
  setPage: ActionCreatorWithPayload<number, 'users/setUsersPage'> | ActionCreatorWithPayload<number, 'product/setProductsPage'>
  total: number
  page: number
  limit: number
}

const Paginator: React.FC<PropsType> = ({ page, total, limit, setPage }) => {
  const totalPages = Math.ceil(total / limit)

  return (
    <Stack spacing={2}>
      <Pagination
        count={totalPages}
        page={page + 1}
        defaultPage={0}
        onChange={(e, page: number) => setPage(page - 1)}
        sx={{
          '& button': { backgroundColor: '#766ED3', color: '#fff' },
          '& button:hover': { color: 'black' },
          '& button.MuiPaginationItem-page': { backgroundColor: 'rgba(99, 139, 136, 0.068)', color: 'black' },
        }}
      />
    </Stack>
    // <div className={styles.wrapper}>
    //   <ul className={styles.items}>
    //     <li className={page + 1 === 1 ? styles.disabled : styles.item} onClick={() => setPage(page < 1 ? page : page - 1)}>
    //       <LeftArrow />
    //     </li>
    //     <li className={styles.item}>{page + 1}</li>
    //     <li className={styles.item}>/</li>
    //     <li className={styles.item}>{totalPages}</li>
    //     <li className={page + 1 === totalPages ? styles.disabled : styles.item} onClick={() => setPage(page === totalPages - 1 ? page : page + 1)}>
    //       <RightArrow />
    //     </li>
    //   </ul>
    // </div>
  )
}

export default Paginator
