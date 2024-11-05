import { envConfig } from '@app/configs'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { GetEpochComputorsResponse, GetLatestStatsResponse } from './qubic-rpc.types'

const BASE_URL = `${envConfig.QUBIC_RPC_URL}/v1`

export const qubicRpcApi = createApi({
  reducerPath: 'qubicRpcApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (build) => ({
    getLatestStats: build.query<GetLatestStatsResponse['data'], void>({
      query: () => '/latest-stats',
      transformResponse: (response: GetLatestStatsResponse) => response.data
    }),
    getEpochComputors: build.query<GetEpochComputorsResponse['computors'], number>({
      query: (epoch: number) => `/epochs/${epoch}/computors`,
      transformResponse: (response: GetEpochComputorsResponse) => response.computors
    })
  })
})

export const { useGetLatestStatsQuery, useGetEpochComputorsQuery } = qubicRpcApi
