import { bindActionCreators } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authAction } from 'store/slices/auth/auth.slice'
import { usersAction } from 'store/slices/users/users.slice'
import { productAction } from 'store/slices/product/product.slice'
import { categoriesAction } from 'store/slices/categories/categories.slice'
import { commentsAction } from 'store/slices/comments/comments.slice'
import { favoritesAction } from 'store/slices/favorites/favorites.slice'
import { AppDispatchType, RootStateType } from 'store/store'

export const useAppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

// use Actions hook
const allActions = {
  ...productAction,
  ...authAction,
  ...usersAction,
  ...categoriesAction,
  ...commentsAction,
  ...favoritesAction,
}

export const useActions = () => {
  const dispatch = useAppDispatch()

  return bindActionCreators(allActions, dispatch)
}
