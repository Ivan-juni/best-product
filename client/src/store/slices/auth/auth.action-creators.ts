import AuthService from 'http/auth-service/auth.service'
import { IUser } from 'models/user.model'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { authAction } from './auth.slice'
import { AuthResponse } from 'http/auth-service/auth.model'
import axios from 'axios'
import { FormikType } from 'models/formik.model'
import { errorLogic } from '../../utils/errorLogic'
import { ErrorType } from 'models/error.model'

export const login = createAsyncThunk<
  void,
  {
    email: string
    password: string
    remember: boolean
  } & FormikType,
  { rejectValue: string }
>('auth/login', async ({ email, password, remember = false, setStatus, setSubmitting }, thunkApi) => {
  try {
    const response = await AuthService.login(email, password, remember)
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))

    if (setSubmitting) {
      setSubmitting(false)
    }
    thunkApi.dispatch(authAction.setLogModalOpen(false))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError, { setStatus, setSubmitting }))
  }
})

export const registration = createAsyncThunk<
  void,
  {
    email: string
    password: string
    firstName: string
    lastName: string
  } & FormikType,
  { rejectValue: string }
>('auth/login', async ({ email, password, firstName, lastName, setStatus, setSubmitting }, thunkApi) => {
  try {
    const response = await AuthService.registration(email, password, firstName, lastName)
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))

    if (setSubmitting) {
      setSubmitting(false)
    }
    thunkApi.dispatch(authAction.setRegModalOpen(false))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError, { setStatus, setSubmitting }))
  }
})

export const logout = createAsyncThunk<void, void, { rejectValue: string }>('auth/login', async (_, thunkApi) => {
  try {
    await AuthService.logout()
    // удаляем токен доступа из localStorage
    localStorage.removeItem('token')
    thunkApi.dispatch(authAction.setAuth(false))
    thunkApi.dispatch(authAction.setUser({} as IUser))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>('auth/refresh', async (_, thunkApi) => {
  try {
    const response = await axios.get<AuthResponse>(`${process.env.REACT_APP_API_URL}/auth/refresh`, { withCredentials: true })
    // сохраняем токен доступа в localStorage
    localStorage.setItem('token', response.data.accessToken)
    thunkApi.dispatch(authAction.setAuth(true))
    thunkApi.dispatch(authAction.setUser(response.data.user))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})
