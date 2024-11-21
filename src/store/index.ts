import { configureStore } from '@reduxjs/toolkit'
import { qliApi } from './apis/qli/qli.api'
import { qubicRpcApi } from './apis/qubic-rpc.api'
import localeReducer from './localeSlice'
import modalReducer from './modalSlice'

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    modal: modalReducer,
    [qliApi.reducerPath]: qliApi.reducer,
    [qubicRpcApi.reducerPath]: qubicRpcApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(qliApi.middleware).concat(qubicRpcApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
