import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../../models/IUser.model'
import { checkAuth, login, logout, registration } from './ActionCreators.auth'

interface AuthState {
  user: IUser
  isLogModalOpen: boolean
  isRegModalOpen: boolean
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
    createdAt: '',
    updatedAt: '',
  },
  isLogModalOpen: false,
  isRegModalOpen: false,
  isAuth: false,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: AuthState) => {
  state.isLoading = false
  state.error = ''
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
    setLogModalOpen: (state: AuthState, action: PayloadAction<boolean>) => {
      return (state = { ...state, isLogModalOpen: action.payload })
    },
    setRegModalOpen: (state: AuthState, action: PayloadAction<boolean>) => {
      return (state = { ...state, isRegModalOpen: action.payload })
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
