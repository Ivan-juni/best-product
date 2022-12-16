import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductResponse } from '../../../http/product-service/product.model'
import { ICategory } from '../../../models/ICategory'
import { IProduct } from '../../../models/IProduct.model'
import { addToFavorites, deleteFromFavorites, fetchFavorites } from './ActionCreators.favorites'

export interface FavoritesState {
  favorites: IProduct[]
  parentCategories: ICategory[]
  total: number
  page: number
  isEditMode: boolean
  isLoading: boolean
  error: string
}

const initialState: FavoritesState = {
  favorites: [],
  parentCategories: [],
  total: 0,
  page: 0,
  isEditMode: false,
  isLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: FavoritesState) => {
  state.isLoading = false
  state.error = ''
}

const pendingReducer = (state: FavoritesState) => {
  state.isLoading = true
}

const rejectionReducer = (state: FavoritesState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const favoritesSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFavorites: (state: FavoritesState, action: PayloadAction<ProductResponse>) => {
      if (action.payload.categories) {
        return (state = { ...state, favorites: action.payload.results, parentCategories: action.payload.categories, total: action.payload.total })
      } else {
        return (state = { ...state, favorites: action.payload.results, total: action.payload.total })
      }
    },
    setFavoritesPage: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    deleteFromFavorites: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, favorites: state.favorites.filter((product) => product.id !== action.payload) })
    },
  },
  extraReducers: {
    [fetchFavorites.fulfilled.type]: fulfilledReducer,
    [deleteFromFavorites.fulfilled.type]: fulfilledReducer,
    [addToFavorites.fulfilled.type]: fulfilledReducer,

    [fetchFavorites.pending.type]: pendingReducer,
    [deleteFromFavorites.pending.type]: pendingReducer,
    [addToFavorites.pending.type]: pendingReducer,

    [fetchFavorites.rejected.type]: rejectionReducer,
    [deleteFromFavorites.rejected.type]: rejectionReducer,
    [addToFavorites.rejected.type]: rejectionReducer,
  },
})

export default favoritesSlice.reducer
export const favoritesAction = favoritesSlice.actions
