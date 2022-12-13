import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductResponse } from '../../../http/product-service/product.model'
import { ICategory } from '../../../models/ICategory'
import { IProduct } from '../../../models/IProduct.model'
import { deleteProduct, editProduct, fetchProducts } from './ActionCreators.product'

export interface ProductState {
  products: IProduct[]
  parentCategories: ICategory[]
  productId: number
  total: number
  limit: number
  page: number
  isEditMode: boolean
  isLoading: boolean
  error: string
}

const initialState: ProductState = {
  products: [],
  parentCategories: [],
  productId: 0,
  total: 0,
  limit: 6,
  page: 0,
  isEditMode: false,
  isLoading: false,
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
    deleteProduct: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, products: state.products.filter((product) => product.id !== action.payload) })
    },
    setProductsPage: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
    },
    setProductId: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, productId: action.payload })
    },
    setEditMode: (state: ProductState, action: PayloadAction<boolean>) => {
      return (state = { ...state, isEditMode: action.payload })
    },
  },
  extraReducers: {
    [fetchProducts.fulfilled.type]: fulfilledReducer,
    [deleteProduct.fulfilled.type]: fulfilledReducer,
    [editProduct.fulfilled.type]: fulfilledReducer,

    [fetchProducts.pending.type]: pendingReducer,
    [deleteProduct.pending.type]: pendingReducer,
    [editProduct.pending.type]: pendingReducer,

    [fetchProducts.rejected.type]: rejectionReducer,
    [deleteProduct.rejected.type]: rejectionReducer,
    [editProduct.rejected.type]: rejectionReducer,
  },
})

export default productSlice.reducer
export const productAction = productSlice.actions
