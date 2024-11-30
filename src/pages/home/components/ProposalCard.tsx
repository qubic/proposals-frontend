import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { CheckCircleIcon, GithubIcon, VotesListIcon } from '@app/assets/icons'
import { Badge, Select, Skeleton, Tooltip } from '@app/components/ui'
import { Button } from '@app/components/ui/buttons'
import { isVotingEnabled } from '@app/configs'
import { useAppDispatch, useWalletConnect } from '@app/hooks'
import { ProposalStatus, type Proposal } from '@app/store/apis/qli'
import { ModalType, showModal } from '@app/store/modalSlice'
import { formatDate, formatString } from '@app/utils'
import ProposalStatusBadge from './ProposalStatusBadge'

const getWinnerOption = (proposal: Proposal) => {
  const sumOptions = Array.from(
    { length: 8 },
    (_, index) => proposal[`sumOption${index as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}`]
  )

  return sumOptions.findIndex((votes) => votes === proposal.mostVotes)
}

type Props = Readonly<{
  proposal: Proposal
  submitText?: string
}>

function ProposalCard({ proposal, submitText = 'Submit' }: Props) {
  const { isWalletConnected, isComputor } = useWalletConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleShowVotesListModal = useCallback(() => {
    dispatch(
      showModal({ modalType: ModalType.VOTES_LIST, modalProps: { votes: proposal.ballots } })
    )
  }, [dispatch, proposal.ballots])

  const winnerOption = useMemo(() => getWinnerOption(proposal), [proposal])

  const isWinningOption = useCallback(
    (option: number) => proposal.status === ProposalStatus.SUCCESS && winnerOption === option,
    [proposal, winnerOption]
  )

  return (
    <article className="max-w-[652px] space-y-20 rounded-12 border border-primary-60 bg-primary-70 p-24">
      <header className="flex flex-col gap-12">
        <div className="flex items-center justify-between gap-24">
          <h1 className="">{proposal.title}</h1>
          <div className="flex w-fit gap-24">
            <Tooltip content={t('home_page.votes_list')}>
              <Button variant="wrapper" onClick={handleShowVotesListModal}>
                <VotesListIcon />
              </Button>
            </Tooltip>
            <Tooltip content={t('home_page.proposal_details')}>
              <a
                href={proposal.url}
                aria-label="proposals-github-link"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon />
              </a>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-between gap-8">
          <div className="flex flex-wrap justify-between gap-8 text-center">
            <p className="text-xxs text-slate-500 sm:text-xs">
              {formatDate(proposal.published, { excludeTimeZone: true })}
            </p>
            <p className="text-xxs text-slate-500 sm:text-xs">
              {t('home_page.published_tick', { tick: formatString(proposal.publishedTick) })}
            </p>
            <p className="text-xxs text-slate-500 sm:text-xs">
              {proposal.latestVoteTick > 0
                ? t('home_page.last_vote', { tick: formatString(proposal.latestVoteTick) })
                : t('home_page.no_votes')}
            </p>
          </div>
          <div className="flex justify-between gap-8">
            <Badge size="xs" className="whitespace-nowrap text-center">
              {proposal.contractName}
            </Badge>
            <ProposalStatusBadge status={proposal.status} />
          </div>
        </div>
      </header>
      <dl className="grid grid-cols-2 gap-16 lg:grid-cols-3">
        {Object.entries(proposal.resultSummary).map(([voteOption, votesList]) => (
          <div key={voteOption}>
            <dt className="text-xs text-gray-50">
              {t('home_page.vote_option', {
                number: voteOption
              })}
            </dt>
            <dd className="flex items-center gap-2">
              {isWinningOption(Number(voteOption)) && (
                <CheckCircleIcon className="size-18 text-success-40" />
              )}
              {t('home_page.votes_count', {
                count: votesList.length
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
