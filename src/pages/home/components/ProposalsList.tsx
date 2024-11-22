import { memo } from 'react'

import { Alert } from '@app/components/ui'
import type { Proposal } from '@app/store/apis/qli'
import ProposalCard from './ProposalCard'

type Props = Readonly<{
  proposals: Proposal[] | undefined
  isFetching: boolean
  isError: boolean
  noDataMessage: string
  errorMessage: string
}>

const ProposalsSkeleton = memo(() =>
  Array.from({ length: 3 }).map((_, index) => <ProposalCard.Skeleton key={String(`${index}`)} />)
)

function ProposalsList({ isFetching, isError, proposals, noDataMessage, errorMessage }: Props) {
  if (isFetching) return <ProposalsSkeleton />

  if (!proposals || isError) return <Alert variant="error">{errorMessage}</Alert>

  if (!proposals.length) return <Alert variant="info">{noDataMessage}</Alert>

  return (
    <ul className="grid gap-24">
      {proposals.map((proposal) => (
        <li key={proposal.url}>
          <ProposalCard key={proposal.url} proposal={proposal} />
        </li>
      ))}
    </ul>
  )
}

const MemoizedProposalsList = memo(ProposalsList)

export default MemoizedProposalsList
