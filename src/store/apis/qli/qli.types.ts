export enum ProposalStatus {
  DRAFT = 0,
  PUBLISHING = 1,
  PENDING = 2,
  SUCCESS = 3,
  FAILED = 4,
  CANCELED = 5
}

export interface User {
  id: string
  name: string
  avatar: string | null
  status: string
  privileges: string[]
  is2FAEnabled: boolean
}

export interface GetUserResponse {
  success: boolean
  token: string
  refreshToken: string
  user: User
}

export interface Vote {
  computorId: string
  vote: number
  voteTick: number
}

export interface Proposal {
  latestVoteTick: number
  reportCreated: string
  status: ProposalStatus
  url: string
  proposerIdentity: string // initiator/creator of the proposal
  totalVotes: number
  publishedTick: number
  published: string
  contractIndex: number
  contractName: string
  proposalIndex: number
  numberOfOptions: number
  proposalType: number
  proposalTick: number
  epoch: number
  tickForPublish: number
  ballots: Vote[]
  resultSummary: Record<string, Vote[]>
  mostVotes: number
  sumOption0: number
  sumOption1: number
  sumOption2: number
  sumOption3: number
  sumOption4: number
  sumOption5: number
  sumOption6: number
  sumOption7: number
  title: string
  description?: string | null
  options?: string | null
  hasVotes: boolean
}

export interface GetEndedProposalsResponse {
  count: number
  page: number
  pageSize: number
  result: Proposal[]
}
