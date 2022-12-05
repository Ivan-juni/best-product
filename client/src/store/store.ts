import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth/Auth.slice'

const rootReducer = combineReducers({
  authReducer,
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export type RootStateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof setupStore>
export type AppDispatchType = AppStoreType['dispatch']
