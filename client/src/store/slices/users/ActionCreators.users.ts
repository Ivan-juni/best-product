import { CombinedState, createAsyncThunk } from '@reduxjs/toolkit'
import { usersAction, UsersState } from './Users.slice'
import UsersService from '../../../http/users-service/users.service'
import { ChangingValues } from '../../../http/users-service/user.model'
import { authAction } from '../auth/Auth.slice'
import { FormikType } from '../../../models/Formik.model'
import { ErrorType } from '../../../models/IError.model'
import { errorLogic } from '../../utils/errorLogic'

// тут setStatus, setSubmitting опциональные параметры, так как я использовую editProfile и в Formik и без него
type EditProfileType = ChangingValues & { setStatus?: (arg0: string) => void; setSubmitting?: (arg0: boolean) => void }

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
  { id: number; role: 'ADMIN' | 'USER' },
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
