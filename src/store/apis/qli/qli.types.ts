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
  computorIndex: number
  computorId: string
  shortCode: string | null
  vote: number
  voteTick: number
  proposalIndex: number
  contractIndex: number
  proposalTick: number
}

export interface Proposal {
  latestVoteTick: number
  reportCreated: string
  status: number
  url: string
  computorIndex: number
  shortCode: string
  computorId: string
  isPublished: boolean
  totalVotes: number
  publishedTick: number
  published: string
  tickForPublish: number
  ballots: Vote[]
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
  description: string | null
  options: string | null
  hasVotes: boolean
  selectedOption: string | null
  resultSummary: {
    [key: string]: Vote[]
  }
}
