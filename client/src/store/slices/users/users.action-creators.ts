import { CombinedState, createAsyncThunk } from '@reduxjs/toolkit'
import { usersAction, UsersState } from './users.slice'
import UsersService from 'http/users-service/users.service'
import { ChangingValues } from 'http/users-service/user.model'
import { authAction } from '../auth/auth.slice'
import { FormikType } from 'models/formik.model'
import { ErrorType } from 'models/error.model'
import { errorLogic } from '../../utils/errorLogic'
import { ROLES } from 'models/user.model'

type EditProfileType = ChangingValues & FormikType

export const editProfile = createAsyncThunk<void, EditProfileType, { rejectValue: string }>(
  'users/editProfile',
  async ({ setStatus, setSubmitting, ...changingValues }, thunkApi) => {
    try {
      const response = await UsersService.editProfile(changingValues)

      // убираем поле пароля из response
      const { password, ...user } = response.data

      thunkApi.dispatch(authAction.setUser(user))

      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, { setStatus, setSubmitting }))
    }
  }
)

type FetchUsersType = FormikType & { id: string | null; firstName: string | null; page?: number; limit?: number }

export const fetchUsers = createAsyncThunk<void, FetchUsersType, { rejectValue: string }>(
  'users/fetchUsers',
  async ({ id, firstName, page, limit, setStatus, setSubmitting }, thunkApi) => {
    try {
      const response = await UsersService.getUsers(id, firstName, page, limit)

      thunkApi.dispatch(usersAction.setUsers(response.data))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, { setStatus, setSubmitting }))
    }
  }
)

export const fetchUser = createAsyncThunk<void, FormikType & { id: number }, { rejectValue: string }>(
  'users/fetchUser',
  async ({ id, setStatus, setSubmitting }, thunkApi) => {
    try {
      const response = await UsersService.getUserById(id)

      thunkApi.dispatch(usersAction.setUsers({ results: [response.data], total: 1 }))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, { setStatus, setSubmitting }))
    }
  }
)

export const deleteUser = createAsyncThunk<void, { id: number }, { rejectValue: string; state: CombinedState<{ usersReducer: UsersState }> }>(
  'users/deleteUser',
  async ({ id }, thunkApi) => {
    try {
      await UsersService.deleteUser(id)

      // для корректной работы пагинатора
      const state = thunkApi.getState().usersReducer

      await thunkApi.dispatch(fetchUsers({ id: null, firstName: null, page: state.page }))
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError))
    }
  }
)

export const changeRole = createAsyncThunk<
  void,
  { id: number; role: ROLES.ADMIN | ROLES.USER },
  { rejectValue: string; state: CombinedState<{ usersReducer: UsersState }> }
>('users/changeRole', async ({ id, role }, thunkApi) => {
  try {
    await UsersService.changeRole(id, role)

    // для корректной работы пагинатора
    const page = thunkApi.getState().usersReducer.page

    await thunkApi.dispatch(fetchUsers({ id: null, firstName: null, page }))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})
