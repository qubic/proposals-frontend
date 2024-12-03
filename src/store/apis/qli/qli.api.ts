import { createApi } from '@reduxjs/toolkit/query/react'
import { qliBaseQuery } from './qli.base-query'
import type { GetEndedProposalsResponse, GetUserResponse, Peer, Proposal } from './qli.types'

export const qliApi = createApi({
  reducerPath: 'qliApi',
  baseQuery: qliBaseQuery,
  endpoints: (build) => ({
    getUser: build.query<GetUserResponse, void>({
      query: () => '/Auth/GetUser'
    }),
    getActiveProposals: build.query<Proposal[], void>({
      query: () => '/Voting/Proposal'
    }),
    getEndedProposals: build.query<GetEndedProposalsResponse, void>({
      query: () => '/Voting/History'
    }),
    getPeers: build.query<Peer[], void>({
      query: () => '/Public/Peers'
    })
  })
})

export const { useGetActiveProposalsQuery, useGetEndedProposalsQuery, useGetPeersQuery } = qliApi
