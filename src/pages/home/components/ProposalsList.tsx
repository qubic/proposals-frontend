import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { Alert } from '@app/components/ui'
import type { Peer, Proposal } from '@app/store/apis/qli'
import ProposalCard from './ProposalCard'

type Props = Readonly<{
  proposals: Proposal[] | undefined
  isFetching: boolean
  isError: boolean
  noDataMessage: string
  errorMessage: string
  peers: Peer[]
}>

const ProposalsSkeleton = memo(() =>
  Array.from({ length: 3 }).map((_, index) => <ProposalCard.Skeleton key={String(`${index}`)} />)
)

const groupByEpoch = (proposals: Proposal[]) => {
  return proposals.reduce<Record<number, Proposal[]>>((result, proposal) => {
    const epochGroup = result[proposal.epoch] || []
    return {
      ...result,
      [proposal.epoch]: [...epochGroup, proposal]
    }
  }, {})
}

function ProposalsList({
  isFetching,
  isError,
  proposals,
  noDataMessage,
  errorMessage,
  peers
}: Props) {
  const { t } = useTranslation()

  if (isFetching) return <ProposalsSkeleton />

  if (!proposals || isError) return <Alert variant="error">{errorMessage}</Alert>

  if (!proposals.length) return <Alert variant="info">{noDataMessage}</Alert>

  const groupedProposals = groupByEpoch(proposals)

  const sortedGroupedProposals = Object.entries(groupedProposals)
    .map(([epoch, epochProposals]) => ({ epoch: Number(epoch), epochProposals }))
    .sort((a, b) => b.epoch - a.epoch)

  return (
    <div className="space-y-20">
      {sortedGroupedProposals.map(({ epoch, epochProposals }) => (
        <section key={epoch}>
          <h2 className="mb-10 text-sm text-slate-500">
            {t('global.epoch')} {epoch}
          </h2>
          <ul className="grid gap-24">
            {epochProposals.map((proposal) => (
              <li key={proposal.proposalId}>
                <ProposalCard proposal={proposal} peers={peers} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

const MemoizedProposalsList = memo(ProposalsList)

export default MemoizedProposalsList
