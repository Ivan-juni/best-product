import { RootStateType } from 'store/store'

export const getProductState = (state: RootStateType) => state.productReducer

export const getProductStats = (state: RootStateType) => state.productReducer.stats

export const getProducts = (state: RootStateType) => state.productReducer.products

export const getSearchProducts = (state: RootStateType) => state.productReducer.searchProducts

export const getMenuInfo = (state: RootStateType) => state.productReducer.menuInfo
