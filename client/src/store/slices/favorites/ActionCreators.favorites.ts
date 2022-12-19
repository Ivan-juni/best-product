import { createAsyncThunk } from '@reduxjs/toolkit'
import FavoriteService from '../../../http/favorites-service/favorites.service'
import { FormikType } from '../../../models/Formik.model'
import { IProductQuery } from '../../../models/IProduct.model'
import { authAction } from '../auth/Auth.slice'
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
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (searchCriteria.setSubmitting && searchCriteria.setStatus) {
        searchCriteria.setStatus(error.response?.data?.message)
        searchCriteria.setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchFavoritesIds = createAsyncThunk<void, void, { rejectValue: string }>('favorites/fetchIds', async (_, thunkApi) => {
  try {
    const response = await FavoriteService.getFavoritesIds()

    const ids = response.data[0].ids.split(',').map(Number)

    thunkApi.dispatch(favoritesAction.setFavoritesIds(ids))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const deleteFromFavorites = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/delete', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteFromFavorites(id)

    thunkApi.dispatch(favoritesAction.deleteFromFavorites(id))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const addToFavorites = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/add', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.addToFavorites(id)

    thunkApi.dispatch(favoritesAction.setFavoriteId(id))
    thunkApi.dispatch(fetchFavorites({}))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

// likes / dislikes
export const addLike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/addLike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.setLike(id)

    thunkApi.dispatch(favoritesAction.setLike(id))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const addDislike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/addDislike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.setDislike(id)

    thunkApi.dispatch(favoritesAction.setLike(id))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const deleteLike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/deleteLike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteLike(id)
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})

export const deleteDislike = createAsyncThunk<void, { id: number }, { rejectValue: string }>('favorites/deleteDislike', async ({ id }, thunkApi) => {
  try {
    await FavoriteService.deleteDislike(id)
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})
