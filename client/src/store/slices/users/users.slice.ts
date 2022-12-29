import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from 'models/user.model'
import { ObjectionPage } from 'models/objection-page.model'
import { changeRole, deleteUser, editProfile, fetchUser, fetchUsers } from './users.action-creators'

export interface UsersState {
  users: IUser[]
  total: number
  page: number
  isLoading: boolean
  error: string
}

const initialState: UsersState = {
  users: [],
  total: 0,
  page: 0,
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
    deleteUser: (state: UsersState, action: PayloadAction<number>) => {
      return (state = { ...state, users: state.users.filter((user) => user.id !== action.payload), total: state.total - 1 })
    },
    setUsersPage: (state: UsersState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
  },
  extraReducers: {
    [fetchUsers.fulfilled.type]: fulfilledReducer,
    [fetchUser.fulfilled.type]: fulfilledReducer,
    [editProfile.fulfilled.type]: fulfilledReducer,
    [deleteUser.fulfilled.type]: fulfilledReducer,
    [changeRole.fulfilled.type]: fulfilledReducer,

    [fetchUsers.pending.type]: pendingReducer,
    [fetchUser.pending.type]: pendingReducer,
    [editProfile.pending.type]: pendingReducer,
    [deleteUser.pending.type]: pendingReducer,
    [changeRole.pending.type]: pendingReducer,

    [fetchUsers.rejected.type]: rejectionReducer,
    [fetchUser.rejected.type]: rejectionReducer,
    [editProfile.rejected.type]: rejectionReducer,
    [deleteUser.rejected.type]: rejectionReducer,
    [changeRole.rejected.type]: rejectionReducer,
  },
})

export default usersSlice.reducer
export const usersAction = usersSlice.actions
