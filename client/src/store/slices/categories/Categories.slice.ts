import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICategory } from '../../../models/ICategory'
import { ObjectionPage } from '../../../models/ObjectionPage.model'
import { addCategory, deleteCategory, fetchCategories, fetchCategory, fetchSearchCategories, updateCategory } from './ActionCreators.categories'

export interface CategoriesState {
  categories: ICategory[]
  searchCategories: ICategory[]
  allCategories: ICategory[]
  total: number
  page: number
  isLoading: boolean
  isSearchLoading: boolean
  error: string
}

const initialState: CategoriesState = {
  categories: [],
  searchCategories: [],
  allCategories: [],
  total: 0,
  page: 0,
  isLoading: false,
  isSearchLoading: false,
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
    setSearchCategories: (state: CategoriesState, action: PayloadAction<ObjectionPage<ICategory[]>>) => {
      return (state = {
        ...state,
        searchCategories: action.payload.results,
        // total: action.payload.total
      })
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
      return (state = { ...state, categories: state.categories.filter((category) => category.id !== action.payload), total: state.total - 1 })
    },
  },
  extraReducers: {
    [fetchCategories.fulfilled.type]: fulfilledReducer,
    [fetchCategory.fulfilled.type]: fulfilledReducer,
    [deleteCategory.fulfilled.type]: fulfilledReducer,
    [updateCategory.fulfilled.type]: fulfilledReducer,
    [addCategory.fulfilled.type]: fulfilledReducer,
    [fetchSearchCategories.fulfilled.type]: (state: CategoriesState) => {
      state.isSearchLoading = false
      state.error = ''
    },

    [fetchCategories.pending.type]: pendingReducer,
    [fetchCategory.pending.type]: pendingReducer,
    [deleteCategory.pending.type]: pendingReducer,
    [updateCategory.pending.type]: pendingReducer,
    [addCategory.pending.type]: pendingReducer,
    [fetchSearchCategories.pending.type]: (state: CategoriesState) => {
      state.isSearchLoading = true
    },

    [fetchCategories.rejected.type]: rejectionReducer,
    [fetchCategory.rejected.type]: rejectionReducer,
    [deleteCategory.rejected.type]: rejectionReducer,
    [updateCategory.rejected.type]: rejectionReducer,
    [addCategory.rejected.type]: rejectionReducer,
    [fetchSearchCategories.rejected.type]: (state: CategoriesState, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export default categoriesSlice.reducer
export const categoriesAction = categoriesSlice.actions
