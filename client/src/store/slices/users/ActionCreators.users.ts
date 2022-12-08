import { createAsyncThunk } from '@reduxjs/toolkit'
import { usersAction } from './Users.slice'
import UsersService from '../../../http/users-service/users.service'
import { ChangingValues } from '../../../http/users-service/user.model'
import { authAction } from '../auth/Auth.slice'

export const fetchUsers = createAsyncThunk<void, void, { rejectValue: string }>('users/', async (_, thunkApi) => {
  try {
    // const response =  await UsersService
    //   // удаляем токен доступа из localStorage
    //   localStorage.removeItem('token')
    //   thunkApi.dispatch(authAction.setAuth(false))
    //   thunkApi.dispatch(authAction.setUser({} as IUser))
  } catch (error: any) {
    //   console.log(error.response?.data?.message)
    //   return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

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
