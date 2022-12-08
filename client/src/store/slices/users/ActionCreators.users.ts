import { createAsyncThunk } from '@reduxjs/toolkit'
import { usersAction } from './Users.slice'
import UsersService from '../../../http/users-service/users.service'
import { ChangingValues } from '../../../http/users-service/user.model'
import { authAction } from '../auth/Auth.slice'
import { FormikType } from '../../../models/Formik.model'

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
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (setSubmitting && setStatus) {
        setStatus(error.response?.data?.message)
        setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
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
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (setSubmitting && setStatus) {
        setStatus(error.response?.data?.message)
        setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)
