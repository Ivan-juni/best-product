import { createAsyncThunk } from '@reduxjs/toolkit'
import { CategoryAddingValues, CategoryChangingValues } from 'http/categories-service/categories.model'
import CategoriesService from 'http/categories-service/categories.service'
import { FormikType } from 'models/formik.model'
import { ICategoryQuery } from 'models/category.model'
import { ErrorType } from 'models/error.model'
import { errorLogic } from '../../utils/errorLogic'
import { categoriesAction } from './categories.slice'

type FetchCategoriesType = FormikType & ICategoryQuery

export const fetchCategories = createAsyncThunk<void, FetchCategoriesType, { rejectValue: string }>(
  'categories/fetchCategories',
  async (values, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из values
      const { setSubmitting, setStatus, ...searchCriteria } = values

      const criteriaCategories = await CategoriesService.getCategories(searchCriteria)
      const allCategories = await CategoriesService.getCategories({ limit: 1000 })

      thunkApi.dispatch(categoriesAction.setCategories(criteriaCategories.data))
      thunkApi.dispatch(categoriesAction.setAllCategories(allCategories.data))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)

export const fetchSearchCategories = createAsyncThunk<void, FetchCategoriesType, { rejectValue: string }>(
  'categories/fetchSearchCategories',
  async (values, thunkApi) => {
    try {
      // убираем поля setSubmitting, setStatus из values
      const { setSubmitting, setStatus, ...searchCriteria } = values

      const criteriaCategories = await CategoriesService.getCategories(searchCriteria)

      thunkApi.dispatch(categoriesAction.setSearchCategories(criteriaCategories.data))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)

export const fetchCategory = createAsyncThunk<void, FormikType & { id: number }, { rejectValue: string }>(
  'categories/fetchCategory',
  async (values, thunkApi) => {
    try {
      const { id, setSubmitting } = values

      const response = await CategoriesService.getCategoryById(id)

      thunkApi.dispatch(categoriesAction.setCategories({ results: [response.data], total: 1 }))
      if (setSubmitting) {
        setSubmitting(false)
      }
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError, values))
    }
  }
)

export const deleteCategory = createAsyncThunk<void, { id: number }, { rejectValue: string }>(
  'categories/deleteCategory',
  async ({ id }, thunkApi) => {
    try {
      await CategoriesService.deleteCategory(id)

      thunkApi.dispatch(categoriesAction.deleteCategory(id))
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError))
    }
  }
)

export const updateCategory = createAsyncThunk<void, { id: number } & CategoryChangingValues, { rejectValue: string }>(
  'categories/updateCategory',
  async (changingValues, thunkApi) => {
    try {
      const { id, ...rest } = changingValues

      const response = await CategoriesService.updateCategory(id, rest)

      thunkApi.dispatch(categoriesAction.updateCategory(response.data))
      // thunkApi.dispatch(fetchCategories({}))
    } catch (error) {
      const typedError = error as ErrorType
      return thunkApi.rejectWithValue(errorLogic(typedError))
    }
  }
)

type AddCategoryType = CategoryAddingValues & FormikType

export const addCategory = createAsyncThunk<void, AddCategoryType, { rejectValue: string }>('categories/addCategory', async (values, thunkApi) => {
  try {
    const { setStatus, setSubmitting, ...category } = values

    await CategoriesService.addCategory(category)

    thunkApi.dispatch(fetchCategories({}))

    if (setSubmitting) {
      setSubmitting(false)
    }
  } catch (error) {
    const typedError = error as ErrorType
    return thunkApi.rejectWithValue(errorLogic(typedError, values))
  }
})
