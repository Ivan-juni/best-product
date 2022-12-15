import { createAsyncThunk } from '@reduxjs/toolkit'
import CategoriesService from '../../../http/categories-service/categories.service'
import { FormikType } from '../../../models/Formik.model'
import { categoriesAction } from './Categories.slice'

type FetchCategoriesType = FormikType & { id?: number }

export const fetchCategories = createAsyncThunk<void, FetchCategoriesType, { rejectValue: string }>(
  'categories/fetchCategories',
  async (params, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из params
      const { setSubmitting, setStatus, ...searchCriteria } = params

      const response = await CategoriesService.getCategories(searchCriteria)

      thunkApi.dispatch(categoriesAction.setCategories(response.data))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error: any) {
      console.log(error.response?.data?.message)
      if (params.setSubmitting && params.setStatus) {
        params.setStatus(error.response?.data?.message)
        params.setSubmitting(false)
      }
      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

export const deleteCategory = createAsyncThunk<void, { id: number }, { rejectValue: string }>(
  'categories/deleteCategory',
  async ({ id }, thunkApi) => {
    try {
    } catch (error: any) {
      console.log(error.response?.data?.message)

      return thunkApi.rejectWithValue(error.response?.data?.message)
    }
  }
)

// export const addCategory = createAsyncThunk<void, { id: number }, { rejectValue: string }>('categories/addCategory', async ({ id }, thunkApi) => {
//   try {
//   } catch (error: any) {
//     console.log(error.response?.data?.message)

//     return thunkApi.rejectWithValue(error.response?.data?.message)
//   }
// })
