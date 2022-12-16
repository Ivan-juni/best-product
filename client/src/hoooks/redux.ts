import { bindActionCreators } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authAction } from '../store/slices/auth/Auth.slice'
import { usersAction } from '../store/slices/users/Users.slice'
import { productAction } from '../store/slices/product/Product.slice'
import { categoriesAction } from '../store/slices/categories/Categories.slice'
import { commentsAction } from '../store/slices/comments/Comments.slice'
import { favoritesAction } from '../store/slices/favorites/Favorites.slice'
import { AppDispatchType, RootStateType } from '../store/store'

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
