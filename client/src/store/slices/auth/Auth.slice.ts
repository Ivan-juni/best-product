import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IError } from '../../../models/IError.model'
import { IUser } from '../../../models/IUser.model'
import { checkAuth, login, logout, registration } from './ActionCreators.auth'

interface AuthState {
  user: IUser
  isAuth: boolean
  isLoading: boolean
  error: string
}

const initialState: AuthState = {
  user: {
    id: 0,
    email: '',
    phone: null,
    firstName: '',
    lastName: '',
    photo: null,
    // password: '',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  isAuth: false,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: AuthState, action: PayloadAction<IUser>) => {
  state.isLoading = false
  state.error = ''
  // state.user = action.payload
}

const pendingReducer = (state: AuthState) => {
  state.isLoading = true
}

const rejectionReducer = (state: AuthState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state: AuthState, action: PayloadAction<boolean>) => {
      return (state = { ...state, isAuth: action.payload })
    },
    setUser: (state: AuthState, action: PayloadAction<IUser>) => {
      return (state = { ...state, user: action.payload })
    },
  },
  extraReducers: {
    [login.fulfilled.type]: fulfilledReducer,
    [registration.fulfilled.type]: fulfilledReducer,
    [logout.fulfilled.type]: fulfilledReducer,
    [checkAuth.fulfilled.type]: fulfilledReducer,

    [login.pending.type]: pendingReducer,
    [registration.pending.type]: pendingReducer,
    [logout.pending.type]: pendingReducer,
    [checkAuth.pending.type]: pendingReducer,

    [login.rejected.type]: rejectionReducer,
    [registration.rejected.type]: rejectionReducer,
    [logout.rejected.type]: rejectionReducer,
    [checkAuth.rejected.type]: rejectionReducer,
  },
})

export default authSlice.reducer
export const authAction = authSlice.actions
