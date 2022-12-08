import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../../models/IUser.model'
import { ObjectionPage } from '../../../models/ObjectionPage.model'
import { editProfile, fetchUsers } from './ActionCreators.users'

interface UsersState {
  users: IUser[]
  total: number
  isLoading: boolean
  error: string
}

const initialState: UsersState = {
  users: [],
  total: 0,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: UsersState) => {
  state.isLoading = false
  state.error = ''
}

const pendingReducer = (state: UsersState) => {
  state.isLoading = true
}

const rejectionReducer = (state: UsersState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state: UsersState, action: PayloadAction<ObjectionPage<IUser[]>>) => {
      return (state = { ...state, users: action.payload.results, total: action.payload.total })
    },
  },
  extraReducers: {
    [fetchUsers.fulfilled.type]: fulfilledReducer,
    [editProfile.fulfilled.type]: fulfilledReducer,

    [fetchUsers.pending.type]: pendingReducer,
    [editProfile.pending.type]: pendingReducer,

    [fetchUsers.rejected.type]: rejectionReducer,
    [editProfile.rejected.type]: rejectionReducer,
  },
})

export default usersSlice.reducer
export const usersAction = usersSlice.actions
