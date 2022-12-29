import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/product/product.slice'
import authReducer from './slices/auth/auth.slice'
import usersReducer from './slices/users/users.slice'
import categoriesReducer from './slices/categories/categories.slice'
import commentsReducer from './slices/comments/comments.slice'
import favoritesReducer from './slices/favorites/favorites.slice'

const rootReducer = combineReducers({
  productReducer,
  usersReducer,
  authReducer,
  categoriesReducer,
  commentsReducer,
  favoritesReducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export type RootStateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof setupStore>
export type AppDispatchType = AppStoreType['dispatch']
