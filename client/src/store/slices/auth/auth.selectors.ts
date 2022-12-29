import { RootStateType } from 'store/store'

export const getAuthState = (state: RootStateType) => state.authReducer

export const getUser = (state: RootStateType) => state.authReducer.user
