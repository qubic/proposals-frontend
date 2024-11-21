import { useTranslation } from 'react-i18next'

import { GithubIcon, VotesListIcon } from '@app/assets/icons'
import { Select, Skeleton, Tooltip } from '@app/components/ui'
import { Button } from '@app/components/ui/buttons'
import { isVotingEnabled } from '@app/configs'
import { useAppDispatch, useWalletConnect } from '@app/hooks'
import type { Proposal } from '@app/store/apis/qli'
import { ModalType, showModal } from '@app/store/modalSlice'
import { formatDate } from '@app/utils'

type Props = Readonly<{
  proposal: Proposal
  submitText?: string
}>

function ProposalCard({ proposal, submitText = 'Submit' }: Props) {
  const { isWalletConnected, isComputor } = useWalletConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const handleShowVotesListModal = () => {
    dispatch(
      showModal({ modalType: ModalType.VOTES_LIST, modalProps: { votes: proposal.ballots } })
    )
  }

  return (
    <article className="max-w-[652px] space-y-24 rounded-12 border border-primary-60 bg-primary-70 p-24">
      <header className="flex flex-col gap-12">
        <div className="flex justify-between gap-24">
          <h1>{proposal.title}</h1>
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
        <div className="flex justify-between gap-24">
          <p className="text-xs text-slate-500">
            {formatDate(proposal.published)} @ {proposal.publishedTick}
          </p>
          <p className="text-end text-xs text-slate-500">
            {t('home_page.last_vote', { tick: proposal.latestVoteTick })}
          </p>
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
            <dd>
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
  return <Skeleton className="h-[183px] max-w-[652px] space-y-24 rounded-12 md:h-[167px]" />
}

export default ProposalCard
