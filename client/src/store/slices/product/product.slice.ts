import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductMenuInfo, ProductResponse } from '../../../http/product-service/product.model'
import { ICategory } from 'models/category.model'
import { IProduct } from 'models/product.model'
import { IPriceDynamics, IStats } from 'models/stats.model'
import {
  fetchProducts,
  addImage,
  deleteImage,
  deleteProduct,
  editProduct,
  addProduct,
  fetchStats,
  fetchPriceDynamics,
  fetchSearchProducts,
  fetchMenuInfo,
  fetchProduct,
} from './product.action-creators'

export interface ProductState {
  products: IProduct[]
  searchProducts: IProduct[]
  parentCategories: ICategory[]
  stats: IStats
  menuInfo: ProductMenuInfo
  priceDynamics: IPriceDynamics[]
  productId: number
  total: number
  page: number
  limit: number
  cardType: boolean
  isEditMode: boolean
  isLoading: boolean
  isSearchLoading: boolean
  error: string
}

const initialState: ProductState = {
  products: [],
  searchProducts: [],
  parentCategories: [],
  stats: {} as IStats,
  menuInfo: {} as ProductMenuInfo,
  priceDynamics: [],
  productId: 0,
  total: 0,
  page: 0,
  limit: 9,
  cardType: false,
  isEditMode: false,
  isLoading: false,
  isSearchLoading: false,
  error: '',
}

// status handlers for thunks
const fulfilledReducer = (state: ProductState) => {
  state.isLoading = false
  state.error = ''
}

const pendingReducer = (state: ProductState) => {
  state.isLoading = true
}

const rejectionReducer = (state: ProductState, action: PayloadAction<string>) => {
  state.isLoading = false
  state.error = action.payload
}

// Slice
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state: ProductState, action: PayloadAction<ProductResponse>) => {
      if (action.payload.categories) {
        return (state = { ...state, products: action.payload.results, parentCategories: action.payload.categories, total: action.payload.total })
      } else {
        return (state = { ...state, products: action.payload.results, total: action.payload.total })
      }
    },
    setSearchProducts: (state: ProductState, action: PayloadAction<ProductResponse>) => {
      return (state = {
        ...state,
        searchProducts: action.payload.results,
        // total: action.payload.total,
      })
    },
    setMenuInfo: (state: ProductState, action: PayloadAction<ProductMenuInfo>) => {
      return (state = {
        ...state,
        menuInfo: action.payload,
      })
    },
    setProductsPage: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    setLimit: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, limit: action.payload })
    },
    setProductId: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, productId: action.payload })
    },
    setEditMode: (state: ProductState, action: PayloadAction<boolean>) => {
      return (state = { ...state, isEditMode: action.payload })
    },
    setStats: (state: ProductState, action: PayloadAction<IStats>) => {
      return (state = { ...state, stats: action.payload })
    },
    setPriceDynamics: (state: ProductState, action: PayloadAction<IPriceDynamics[]>) => {
      return (state = { ...state, priceDynamics: action.payload })
    },
    setProductsCardType: (state: ProductState, action: PayloadAction<boolean>) => {
      return (state = { ...state, cardType: action.payload })
    },
    deleteProduct: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, products: state.products.filter((product) => product.id !== action.payload), total: state.total - 1 })
    },
  },
  extraReducers: {
    [fetchProducts.fulfilled.type]: fulfilledReducer,
    [fetchProduct.fulfilled.type]: fulfilledReducer,
    [fetchMenuInfo.fulfilled.type]: fulfilledReducer,
    [deleteProduct.fulfilled.type]: fulfilledReducer,
    [editProduct.fulfilled.type]: fulfilledReducer,
    [addProduct.fulfilled.type]: fulfilledReducer,
    [addImage.fulfilled.type]: fulfilledReducer,
    [deleteImage.fulfilled.type]: fulfilledReducer,
    [fetchStats.fulfilled.type]: fulfilledReducer,
    [fetchPriceDynamics.fulfilled.type]: fulfilledReducer,
    [fetchSearchProducts.fulfilled.type]: (state: ProductState) => {
      state.isSearchLoading = false
      state.error = ''
    },

    [fetchProducts.pending.type]: pendingReducer,
    [fetchProduct.pending.type]: pendingReducer,
    [fetchMenuInfo.pending.type]: pendingReducer,
    [deleteProduct.pending.type]: pendingReducer,
    [editProduct.pending.type]: pendingReducer,
    [addProduct.pending.type]: pendingReducer,
    [addImage.pending.type]: pendingReducer,
    [deleteImage.pending.type]: pendingReducer,
    [fetchStats.pending.type]: pendingReducer,
    [fetchPriceDynamics.pending.type]: pendingReducer,
    [fetchSearchProducts.pending.type]: (state: ProductState) => {
      state.isSearchLoading = true
    },

    [fetchProducts.rejected.type]: rejectionReducer,
    [fetchProduct.rejected.type]: rejectionReducer,
    [fetchMenuInfo.rejected.type]: rejectionReducer,
    [deleteProduct.rejected.type]: rejectionReducer,
    [editProduct.rejected.type]: rejectionReducer,
    [addProduct.rejected.type]: rejectionReducer,
    [addImage.rejected.type]: rejectionReducer,
    [deleteImage.rejected.type]: rejectionReducer,
    [fetchStats.rejected.type]: rejectionReducer,
    [fetchPriceDynamics.rejected.type]: rejectionReducer,
    [fetchSearchProducts.rejected.type]: (state: ProductState, action: PayloadAction<string>) => {
      state.isSearchLoading = false
      state.error = action.payload
    },
  },
})

export default productSlice.reducer
export const productAction = productSlice.actions
