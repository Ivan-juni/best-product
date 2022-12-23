import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductResponse } from '../../../http/product-service/product.model'
import { ICategory } from '../../../models/ICategory'
import { IProduct } from '../../../models/IProduct.model'
import {
  addDislike,
  addLike,
  addToFavorites,
  addView,
  deleteDislike,
  deleteFromFavorites,
  deleteLike,
  fetchFavorites,
  fetchFavoritesIds,
} from './ActionCreators.favorites'

export interface FavoritesState {
  favorites: IProduct[]
  ids: number[]
  likes: number[]
  dislikes: number[]
  views: number[]
  parentCategories: ICategory[]
  total: number
  page: number
  limit: number
  cardType: boolean
  isEditMode: boolean
  isLoading: boolean
  error: string
}

const initialState: FavoritesState = {
  favorites: [],
  ids: [],
  likes: [],
  dislikes: [],
  views: [],
  parentCategories: [],
  total: 0,
  page: 0,
  limit: 9,
  cardType: false,
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
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state: FavoritesState, action: PayloadAction<ProductResponse>) => {
      if (action.payload.categories) {
        return (state = { ...state, favorites: action.payload.results, parentCategories: action.payload.categories, total: action.payload.total })
      } else {
        return (state = { ...state, favorites: action.payload.results, total: action.payload.total })
      }
    },
    setFavoritesIds: (state: FavoritesState, action: PayloadAction<number[]>) => {
      return (state = { ...state, ids: action.payload })
    },
    setFavoriteId: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, ids: [...state.ids, action.payload] })
    },
    setFavoritesPage: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    setLimit: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, limit: action.payload })
    },
    setFavoritesCardType: (state: FavoritesState, action: PayloadAction<boolean>) => {
      return (state = { ...state, cardType: action.payload })
    },
    deleteFromFavorites: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = {
        ...state,
        favorites: state.favorites.filter((product) => product.id !== action.payload),
        ids: state.ids.filter((id) => id !== action.payload),
        total: state.total - 1,
      })
    },
    setLike: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, likes: [...state.likes, action.payload] })
    },
    unsetLike: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, likes: state.likes.filter((value) => value !== action.payload) })
    },
    setDislike: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, dislikes: [...state.dislikes, action.payload] })
    },
    unsetDislike: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, dislikes: state.dislikes.filter((value) => value !== action.payload) })
    },
    setView: (state: FavoritesState, action: PayloadAction<number>) => {
      return (state = { ...state, views: [...state.views, action.payload] })
    },
  },
  extraReducers: {
    [fetchFavorites.fulfilled.type]: fulfilledReducer,
    [fetchFavoritesIds.fulfilled.type]: fulfilledReducer,
    [deleteFromFavorites.fulfilled.type]: fulfilledReducer,
    [addToFavorites.fulfilled.type]: fulfilledReducer,
    [addLike.fulfilled.type]: fulfilledReducer,
    [addDislike.fulfilled.type]: fulfilledReducer,
    [deleteLike.fulfilled.type]: fulfilledReducer,
    [deleteDislike.fulfilled.type]: fulfilledReducer,
    [addView.fulfilled.type]: fulfilledReducer,

    [fetchFavorites.pending.type]: pendingReducer,
    [fetchFavoritesIds.pending.type]: pendingReducer,
    [deleteFromFavorites.pending.type]: pendingReducer,
    [addToFavorites.pending.type]: pendingReducer,
    [addLike.fulfilled.type]: pendingReducer,
    [addDislike.fulfilled.type]: pendingReducer,
    [deleteLike.fulfilled.type]: pendingReducer,
    [deleteDislike.fulfilled.type]: pendingReducer,
    [addView.fulfilled.type]: pendingReducer,

    [fetchFavorites.rejected.type]: rejectionReducer,
    [fetchFavoritesIds.rejected.type]: rejectionReducer,
    [deleteFromFavorites.rejected.type]: rejectionReducer,
    [addToFavorites.rejected.type]: rejectionReducer,
    [addLike.fulfilled.type]: rejectionReducer,
    [addDislike.fulfilled.type]: rejectionReducer,
    [deleteLike.fulfilled.type]: rejectionReducer,
    [deleteDislike.fulfilled.type]: rejectionReducer,
    [addView.fulfilled.type]: rejectionReducer,
  },
})

export default favoritesSlice.reducer
export const favoritesAction = favoritesSlice.actions
