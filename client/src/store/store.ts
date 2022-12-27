import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/product/Product.slice'
import authReducer from './slices/auth/Auth.slice'
import usersReducer from './slices/users/Users.slice'
import categoriesReducer from './slices/categories/Categories.slice'
import commentsReducer from './slices/comments/Comments.slice'
import favoritesReducer from './slices/favorites/Favorites.slice'

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
