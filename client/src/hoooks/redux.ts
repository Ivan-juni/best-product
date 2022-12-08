import { bindActionCreators } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authAction } from '../store/slices/auth/Auth.slice'
import { usersAction } from '../store/slices/users/Users.slice'
import { AppDispatchType, RootStateType } from '../store/store'

export const useAppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector

// use Actions hook
const allActions = {
  ...authAction,
  ...usersAction,
}

export const useActions = () => {
  const dispatch = useAppDispatch()

  return bindActionCreators(allActions, dispatch)
}
