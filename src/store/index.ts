import { configureStore } from '@reduxjs/toolkit'
import { qubicRpcApi } from './apis/qubic-rpc.api'
import localeReducer from './localeSlice'
import modalReducer from './modalSlice'

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    modal: modalReducer,
    [qubicRpcApi.reducerPath]: qubicRpcApi.reducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(qubicRpcApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
