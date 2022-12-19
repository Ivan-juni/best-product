import React from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

type PropsType = {
  setPage:
    | ActionCreatorWithPayload<number, 'users/setUsersPage'>
    | ActionCreatorWithPayload<number, 'product/setProductsPage'>
    | ActionCreatorWithPayload<number, 'categories/setCategoriesPage'>
    | ActionCreatorWithPayload<number, 'comments/setCommentsPage'>
    | ActionCreatorWithPayload<number, 'favorites/setFavoritesPage'>
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
  )
}

export default Paginator
