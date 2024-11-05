import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from './userInfo'

const store = configureStore({
  reducer: {
    userInfo: userInfoReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store
