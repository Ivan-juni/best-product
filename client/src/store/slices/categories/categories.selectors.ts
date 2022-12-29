import { RootStateType } from 'store/store'

export const getCategoriesState = (state: RootStateType) => state.categoriesReducer

export const getCategories = (state: RootStateType) => state.categoriesReducer.categories

export const getSearchCategories = (state: RootStateType) => state.categoriesReducer.searchCategories

export const getAllCategories = (state: RootStateType) => state.categoriesReducer.allCategories
