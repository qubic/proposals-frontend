import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  DetailsIcon,
  VotesListIcon
} from '@app/assets/icons'
import { Badge, Select, Skeleton, Tooltip } from '@app/components/ui'
import { Button } from '@app/components/ui/buttons'
import { isVotingEnabled } from '@app/configs'
import { useAppDispatch, useWalletConnect } from '@app/hooks'
import type { Peer, Proposal } from '@app/store/apis/qli'
import { ProposalStatus } from '@app/store/apis/qli'
import { ModalType, showModal } from '@app/store/modalSlice'
import { formatDate } from '@app/utils'
import ProposalStatusBadge from './ProposalStatusBadge'

type Props = Readonly<{
  proposal: Proposal
  peers: Peer[]
  submitText?: string
}>

function ProposalCard({ proposal, peers, submitText = 'Submit' }: Props) {
  const { isWalletConnected, isComputor } = useWalletConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleShowVotesListModal = useCallback(() => {
    dispatch(
      showModal({ modalType: ModalType.VOTES_LIST, modalProps: { votes: proposal.ballots } })
    )
  }, [dispatch, proposal.ballots])

  const handleShowDetailsModal = useCallback(() => {
    dispatch(showModal({ modalType: ModalType.PROPOSAL_DETAILS, modalProps: { proposal, peers } }))
  }, [dispatch, proposal, peers])

  const winnerOption = useMemo(
    () => proposal.options.findIndex(({ numberOfVotes }) => numberOfVotes === proposal.mostVotes),
    [proposal]
  )

  const isWinningOption = useCallback(
    (option: number) =>
      (proposal.status === ProposalStatus.SUCCESS || proposal.status === ProposalStatus.REJECTED) &&
      winnerOption === option,
    [proposal, winnerOption]
  )

  return (
    <article className="max-w-[652px] space-y-16 rounded-12 border border-primary-60 bg-primary-70 p-24">
      <header className="flex flex-col gap-8">
        <div className="flex justify-between gap-8">
          <Badge size="xs" className="whitespace-nowrap text-center">
            {proposal.contractName}
          </Badge>
          <div className="flex w-fit gap-16">
            <Tooltip content={t('home_page.proposal_details')}>
              <Button variant="wrapper" onClick={handleShowDetailsModal}>
                <DetailsIcon className="size-18 text-primary-20" />
              </Button>
            </Tooltip>
            <Tooltip content={t('home_page.votes_list')}>
              <Button variant="wrapper" onClick={handleShowVotesListModal}>
                <VotesListIcon className="size-18" />
              </Button>
            </Tooltip>
            <Tooltip content={t('home_page.proposal_specification')}>
              <a href={proposal.url} aria-label="proposals-link" target="_blank" rel="noreferrer">
                <ArrowTopRightOnSquareIcon className="size-18 text-primary-20" />
              </a>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-start justify-between gap-24">
          <div>
            <h1 className="leading-0">{proposal.title}</h1>
            <p className="text-xxs text-slate-500 sm:text-xs">
              {formatDate(proposal.published, { excludeTimeZone: true })}
            </p>
          </div>
          <ProposalStatusBadge status={proposal.status} />
        </div>
      </header>

      <dl className="flex flex-wrap gap-x-60 gap-y-20">
        {proposal.options.map(({ index: optionNum, label, numberOfVotes }) => (
          <div key={optionNum}>
            <dt className="text-xs">
              {t('home_page.vote_option', {
                number: optionNum
              })}
            </dt>
            <dt className="text-xs text-slate-500">{label}</dt>
            <dd className="flex items-center gap-2">
              {isWinningOption(optionNum) && (
                <CheckCircleIcon className="size-18 text-success-40" />
              )}
              {t('home_page.votes_count', {
                count: numberOfVotes
              })}
            </dd>
          </div>
        ))}
      </dl>
      {isVotingEnabled && isWalletConnected && isComputor && (
        <>
          <Select
            label="Select Vote Option"
            className="!w-full"
            options={[
              { label: 'Mock Option 1', value: 'option-1' },
              { label: 'Mock Option 2', value: 'option-2' },
              { label: 'Mock Option 3', value: 'option-3' },
              { label: 'Mock Option 4', value: 'option-4' }
            ]}
            onSelect={(option) => {
              // eslint-disable-next-line no-console
              console.log('Selected', option)
            }}
          />
          <Button>{submitText}</Button>
        </>
      )}
    </article>
  )
}

ProposalCard.Skeleton = function ProposalCardSkeleton() {
  return <Skeleton className="h-[183px] w-full max-w-[652px] space-y-24 rounded-12 sm:h-[167px]" />
}

export default ProposalCard
