export enum ProposalContractIndex {
  GQMPROP_CONTRACT_INDEX = 6,
  CCF_CONTRACT_INDEX = 8
}

export enum ProposalStatus {
  DRAFT = 0,
  PUBLISHING = 1,
  PENDING = 2,
  SUCCESS = 3,
  FAILED = 4,
  CANCELLED = 5,
  REJECTED = 6, // approved by the voters (accepted by quorum; OPTION 0 won)
  INCONCLUSIVE = 7 // enough for quorum, but none of the options got minimum of 226 votes or multiple had > 226
  // Check if we are going to support these statuses in the future
}

export enum ProposalType {
  GENERAL_OPTIONS = 'GeneralOptions',
  TRANSFER = 'Transfer',
  VARIABLE = 'Variable'
}

export enum TransferType {
  ABSOLUTE = 'Absolute',
  RELATIVE = 'Relative'
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

export interface ProposalOption {
  index: number
  label: string
  value?: string
  numberOfVotes: number
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
  proposalType: ProposalType
  transferType?: TransferType // only present if proposalType=Transfer
  transferUnit?: number // defines the unit of transfer (1 for absolute, 10000 for relative, etc.)
  transferDestinationIdentity?: string // ID of the recipient of the transfer/donation
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
  hasVotes: boolean
  options: ProposalOption[]
  proposalId: string
}

export interface GetEndedProposalsResponse {
  count: number
  page: number
  pageSize: number
  result: Proposal[]
}

export interface Peer {
  ipAddress: string
  currentTick: number
  lastChange: string
}
