import { createAsyncThunk } from '@reduxjs/toolkit'
import FavoriteService from '../../../http/favorites-service/favorites.service'
import { FormikType } from '../../../models/Formik.model'
import { IProductQuery } from '../../../models/IProduct.model'
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

    thunkApi.dispatch(fetchFavorites({}))
  } catch (error: any) {
    console.log(error.response?.data?.message)

    return thunkApi.rejectWithValue(error.response?.data?.message)
  }
})
