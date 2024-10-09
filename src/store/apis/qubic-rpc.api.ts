import { envConfig } from '@app/configs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { GetTickInfoResponse } from './qubic-rpc.types'

const BASE_URL = `${envConfig.QUBIC_RPC_URL}/v1`

export const qubicRpcApi = createApi({
  reducerPath: 'qubicRpcApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    getTickInfo: build.query<GetTickInfoResponse, void>({
      query: () => '/tick-info'
    })
  })
})

export const { useGetTickInfoQuery } = qubicRpcApi
