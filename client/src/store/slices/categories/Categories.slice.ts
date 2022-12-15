import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ICategory } from '../../../models/ICategory'
import { fetchCategories } from './ActionCreators.categories'

export interface CategoriesState {
  categories: ICategory[]
  isLoading: boolean
  error: string
}

const initialState: CategoriesState = {
  categories: [],
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
    setCategories: (state: CategoriesState, action: PayloadAction<ICategory[]>) => {
      return (state = { ...state, categories: action.payload })
    },
    deleteCategory: (state: CategoriesState, action: PayloadAction<number>) => {
      return (state = { ...state, categories: state.categories.filter((category) => category.id !== action.payload) })
    },
  },
  extraReducers: {
    [fetchCategories.fulfilled.type]: fulfilledReducer,

    [fetchCategories.pending.type]: pendingReducer,

    [fetchCategories.rejected.type]: rejectionReducer,
  },
})

export default categoriesSlice.reducer
export const categoriesAction = categoriesSlice.actions
