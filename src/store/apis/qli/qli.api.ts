import { createApi } from '@reduxjs/toolkit/query/react'
import { qliBaseQuery } from './qli.base-query'
import type { GetUserResponse, Proposal } from './qli.types'

export const qliApi = createApi({
  reducerPath: 'qliApi',
  baseQuery: qliBaseQuery,
  endpoints: (build) => ({
    getUser: build.query<GetUserResponse, void>({
      query: () => '/Auth/GetUser'
    }),
    getActiveProposals: build.query<Proposal[], void>({
      query: () => '/Voting/Proposal?epoch=135'
    }),
    // TODO: Update endpoint once it's available
    getEndedProposals: build.query<Proposal[], void>({
      query: () => '/Voting/Proposal?epoch=134'
    })
  })
})

export const { useGetActiveProposalsQuery, useGetEndedProposalsQuery } = qliApi
