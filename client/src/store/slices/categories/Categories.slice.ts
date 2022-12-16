import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICategory } from '../../../models/ICategory'
import { ObjectionPage } from '../../../models/ObjectionPage.model'
import { addCategory, deleteCategory, fetchCategories, updateCategory } from './ActionCreators.categories'

export interface CategoriesState {
  categories: ICategory[]
  allCategories: ICategory[]
  total: number
  page: number
  isLoading: boolean
  error: string
}

const initialState: CategoriesState = {
  categories: [],
  allCategories: [],
  total: 0,
  page: 0,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: CategoriesState) => {
  state.isLoading = false
  state.error = ''
}

const pendingReducer = (state: CategoriesState) => {
  state.isLoading = true
}

const rejectionReducer = (state: CategoriesState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state: CategoriesState, action: PayloadAction<ObjectionPage<ICategory[]>>) => {
      return (state = { ...state, categories: action.payload.results, total: action.payload.total })
    },
    setAllCategories: (state: CategoriesState, action: PayloadAction<ObjectionPage<ICategory[]>>) => {
      return (state = { ...state, allCategories: action.payload.results })
    },
    updateCategory: (state: CategoriesState, action: PayloadAction<ICategory>) => {
      return (state = {
        ...state,
        allCategories: state.allCategories.map((category) => {
          if (category.id === action.payload.id) {
            category = action.payload
          }
          return category
        }),
        categories: state.categories.map((category) => {
          if (category.id === action.payload.id) {
            category = action.payload
          }
          return category
        }),
      })
    },
    setCategoriesPage: (state: CategoriesState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    deleteCategory: (state: CategoriesState, action: PayloadAction<number>) => {
      return (state = { ...state, categories: state.categories.filter((category) => category.id !== action.payload) })
    },
  },
  extraReducers: {
    [fetchCategories.fulfilled.type]: fulfilledReducer,
    [deleteCategory.fulfilled.type]: fulfilledReducer,
    [updateCategory.fulfilled.type]: fulfilledReducer,
    [addCategory.fulfilled.type]: fulfilledReducer,

    [fetchCategories.pending.type]: pendingReducer,
    [deleteCategory.pending.type]: pendingReducer,
    [updateCategory.pending.type]: pendingReducer,
    [addCategory.pending.type]: pendingReducer,

    [fetchCategories.rejected.type]: rejectionReducer,
    [deleteCategory.rejected.type]: rejectionReducer,
    [updateCategory.rejected.type]: rejectionReducer,
    [addCategory.rejected.type]: rejectionReducer,
  },
})

export default categoriesSlice.reducer
export const categoriesAction = categoriesSlice.actions
