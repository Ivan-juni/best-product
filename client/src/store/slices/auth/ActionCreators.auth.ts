import AuthService from '../../../http/auth-service/auth.service'
// import { AppDispatchType } from '../../store'
import { IUser } from '../../../models/IUser.model'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IError } from '../../../models/IError.model'
import { authAction } from './Auth.slice'
import { AuthResponse } from '../../../http/auth-service/auth.model'
import axios from 'axios'

// export const login =
//   (email: string, password: string, remember = false) =>
//   async (dispatch: AppDispatchType) => {
//     try {
//       const response = await AuthService.login(email, password, remember)
//       // сохраняем токен доступа в localStorage
//       localStorage.setItem('token', response.data.accessToken)
//       setAuth(true)
//       setUser(response.data.user)
//     } catch (error: any) {
//       console.log(error.response?.data?.message)
//     }
//   }

// export const registration =
//   (email: string, password: string, firstName: string, lastName: string) =>
//   async (dispatch: AppDispatchType) => {
//     try {
//       const response = await AuthService.registration(
//         email,
//         password,
//         firstName,
//         lastName
//       )
//       // сохраняем токен доступа в localStorage
//       localStorage.setItem('token', response.data.accessToken)
//       setAuth(true)
//       setUser(response.data.user)
//     } catch (error: any) {
//       console.log(error.response?.data?.message)
//     }
//   }

// export const logout = () => async (dispatch: AppDispatchType) => {
//   try {
//     const response = await AuthService.logout()
//     // удаляем токен доступа из localStorage
//     localStorage.removeItem('token')
//     setAuth(false)
//     setUser({} as IUser)
//   } catch (error: any) {
//     console.log(error.response?.data?.message)
//   }
// }

export const login = createAsyncThunk<
  void,
  {
    email: string
    password: string
    remember: boolean
  },
  { rejectValue: string }
>('auth/login', async ({ email, password, remember = false }, thunkApi) => {
  try {
    const response = await AuthService.login(email, password, remember)
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))
  } catch (error: any) {
    console.log(error.response?.data?.message)
    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const registration = createAsyncThunk<
  void,
  {
    email: string
    password: string
    firstName: string
    lastName: string
  },
  { rejectValue: string }
>('auth/login', async ({ email, password, firstName, lastName }, thunkApi) => {
  try {
    const response = await AuthService.registration(email, password, firstName, lastName)
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))
  } catch (error: any) {
    console.log(error.response?.data?.message)
    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const logout = createAsyncThunk<void, void, { rejectValue: string }>('auth/login', async (_, thunkApi) => {
  try {
    await AuthService.logout()
    // удаляем токен доступа из localStorage
    localStorage.removeItem('token')
    thunkApi.dispatch(authAction.setAuth(false))
    thunkApi.dispatch(authAction.setUser({} as IUser))
  } catch (error: any) {
    console.log(error.response?.data?.message)
    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>('auth/refresh', async (_, thunkApi) => {
  try {
    const response = await axios.get<AuthResponse>(`${process.env.REACT_APP_API_URL}/auth/refresh`, { withCredentials: true })
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))
  } catch (error: any) {
    console.log(error.response?.data?.message)
    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})
