import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProductResponse } from '../../../http/product-service/product.model'
import { ICategory } from '../../../models/ICategory'
import { IProduct } from '../../../models/IProduct.model'
import { IStats } from '../../../models/IStats.model'
import { fetchProducts, addImage, deleteImage, deleteProduct, editProduct, addProduct } from './ActionCreators.product'

export interface ProductState {
  products: IProduct[]
  parentCategories: ICategory[]
  stats: IStats
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
  stats: {} as IStats,
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
    setProductsPage: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, page: action.payload })
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
    deleteProduct: (state: ProductState, action: PayloadAction<number>) => {
      return (state = { ...state, products: state.products.filter((product) => product.id !== action.payload) })
    },
    // deleteImage: (state: ProductState, action: PayloadAction<{ productId: number; imageId: number }>) => {
    //   return (state = {
    //     ...state,
    //     products: state.products.filter((product) => {
    //       if (product.id === action.payload.productId) {
    //         product.images.filter((image) => image.id !== action.payload.imageId)
    //       }
    //       return product
    //     }),
    //   })
    // },
  },
  extraReducers: {
    [fetchProducts.fulfilled.type]: fulfilledReducer,
    [deleteProduct.fulfilled.type]: fulfilledReducer,
    [editProduct.fulfilled.type]: fulfilledReducer,
    [addProduct.fulfilled.type]: fulfilledReducer,
    [addImage.fulfilled.type]: fulfilledReducer,
    [deleteImage.fulfilled.type]: fulfilledReducer,

    [fetchProducts.pending.type]: pendingReducer,
    [deleteProduct.pending.type]: pendingReducer,
    [editProduct.pending.type]: pendingReducer,
    [addProduct.pending.type]: pendingReducer,
    [addImage.pending.type]: pendingReducer,
    [deleteImage.pending.type]: pendingReducer,

    [fetchProducts.rejected.type]: rejectionReducer,
    [deleteProduct.rejected.type]: rejectionReducer,
    [editProduct.rejected.type]: rejectionReducer,
    [addProduct.rejected.type]: rejectionReducer,
    [addImage.rejected.type]: rejectionReducer,
    [deleteImage.rejected.type]: rejectionReducer,
  },
})

export default productSlice.reducer
export const productAction = productSlice.actions
