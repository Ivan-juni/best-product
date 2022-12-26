import { createAsyncThunk } from '@reduxjs/toolkit'
import FavoriteService from '../../../http/favorites-service/favorites.service'
import { FormikType } from '../../../models/Formik.model'
import { ErrorType } from '../../../models/IError.model'
import { IProductQuery } from '../../../models/IProduct.model'
import { errorLogic } from '../../utils/errorLogic'
import { favoritesAction } from './Favorites.slice'

// product

type FetchProductsType = FormikType & IProductQuery

export const fetchFavorites = createAsyncThunk<void, FetchProductsType, { rejectValue: string }>(
  'favorites/fetch',
  async (searchCriteria, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из searchCriteria
      const { setSubmitting, setStatus, ...rest } = searchCriteria

      const response = await FavoriteService.getFavorites(rest)

      thunkApi.dispatch(favoritesAction.setFavorites(response.data))

      if (searchCriteria.setSubmitting) {
        searchCriteria.setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, searchCriteria))
    }
  }
)

export const fetchFavoritesIds = createAsyncThunk<void, void, { rejectValue: string }>('favorites/fetchIds', async (_, thunkApi) => {
  try {
    const response = await FavoriteService.getFavoritesIds()

    const ids = response.data[0].ids.split(',').map(Number)

    thunkApi.dispatch(favoritesAction.setFavoritesIds(ids))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const deleteFromFavorites = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/delete', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteFromFavorites(id)

    thunkApi.dispatch(favoritesAction.deleteFromFavorites(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const addToFavorites = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/add', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.addToFavorites(id)

    thunkApi.dispatch(favoritesAction.setFavoriteId(id))
    thunkApi.dispatch(fetchFavorites({}))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

// likes / dislikes / views
export const addLike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/addLike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.setLike(id)

    thunkApi.dispatch(favoritesAction.setLike(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const addDislike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/addDislike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.setDislike(id)

    thunkApi.dispatch(favoritesAction.setDislike(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const deleteLike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/deleteLike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteLike(id)

    thunkApi.dispatch(favoritesAction.unsetLike(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const deleteDislike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/deleteDislike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteDislike(id)

    thunkApi.dispatch(favoritesAction.unsetDislike(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})

export const addView = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/addView', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.setView(id)

    thunkApi.dispatch(favoritesAction.setView(id))
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError))
  }
})
