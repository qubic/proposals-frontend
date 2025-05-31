import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { XmarkIcon } from '@app/assets/icons'
import { PortalModalWrapper } from '@app/components/ui/modals'
import { SMART_CONTRACTS, SmartContractsIndexes } from '@app/constants/qubic'
import { useAppDispatch, useTailwindBreakpoint } from '@app/hooks'
import type { Peer, Proposal } from '@app/store/apis/qli'
import { ProposalContractIndex, ProposalStatus } from '@app/store/apis/qli'
import { hideModal } from '@app/store/modalSlice'
import { formatString } from '@app/utils'
import { CopyTextButton } from '../ui/buttons'
import { ExplorerAddressLink } from '../ui/links'

const genCliCommand = (proposal: Proposal, peers: Peer[]): string => {
  const { contractIndex, proposalIndex } = proposal

  const contractCommandMap: Record<ProposalContractIndex, string> = {
    [ProposalContractIndex.GQMPROP_CONTRACT_INDEX]: 'gqmpropvote',
    [ProposalContractIndex.CCF_CONTRACT_INDEX]: 'ccfvote'
  }

  const proposalContractCommand = contractCommandMap[contractIndex as ProposalContractIndex]
  if (!proposalContractCommand) {
    throw new Error(`Unsupported contractIndex: ${contractIndex}`)
  }

  if (peers?.length === 0) {
    throw new Error('Peers list is empty')
  }

  const randomPeer = peers[Math.floor(Math.random() * peers.length)]

  return `./qubic-cli -seed <ID-SEED> -nodeip ${randomPeer.ipAddress} -${proposalContractCommand} ${proposalIndex} <OPTION-INDEX>`
}

const getDetailsItems = (proposal: Proposal, t: (key: string) => string, isMobile: boolean) => [
  {
    i18nKey: 'home_page.contract_name',
    content: <p>{proposal.contractName}</p>
  },
  {
    i18nKey: 'home_page.proposer',
    content: (
      <ExplorerAddressLink
        value={proposal.proposerIdentity}
        className="sm:text-sm"
        ellipsis={isMobile}
      />
    )
  },
  {
    i18nKey: 'home_page.proposal_type',
    content: (
      <div className="flex gap-4">
        <p className="text-white">&quot;{proposal.proposalType}&quot;</p>
        {proposal.proposalType === 'Transfer' &&
          proposal.contractIndex === SmartContractsIndexes.ComputorControlledFund && (
            <p className="flex gap-4 text-slate-500">
              from
              <ExplorerAddressLink
                label={SMART_CONTRACTS[SmartContractsIndexes.ComputorControlledFund].label}
                value={SMART_CONTRACTS[SmartContractsIndexes.ComputorControlledFund].address}
                className="sm:text-sm"
                ellipsis={isMobile}
              />
            </p>
          )}
        {proposal.proposalType === 'Transfer' && proposal.transferDestinationIdentity && (
          <p className="flex gap-4 text-slate-500">
            to
            <ExplorerAddressLink
              value={proposal.transferDestinationIdentity}
              className="sm:text-sm"
              ellipsis={isMobile}
            />
          </p>
        )}
      </div>
    )
  },
  {
    i18nKey: 'home_page.published_tick',
    content: <p>{formatString(proposal.publishedTick)}</p>
  },
  {
    i18nKey: 'home_page.last_vote',
    content: (
      <p>
        {proposal.latestVoteTick > 0
          ? formatString(proposal.latestVoteTick)
          : t('home_page.no_votes')}
      </p>
    )
  },
  {
    i18nKey: 'home_page.total_votes',
    content: <p>{formatString(proposal.totalVotes)}</p>
  }
]

export type ProposalDetailsModalProps = Readonly<{
  proposal: Proposal
  peers: Peer[]
}>

export default function ProposalDetailsModal({ proposal, peers }: ProposalDetailsModalProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { isMobile } = useTailwindBreakpoint()

  const detailsItems = useMemo(
    () => getDetailsItems(proposal, t, isMobile),
    [proposal, t, isMobile]
  )
  const voteCliCommand = useMemo(() => genCliCommand(proposal, peers), [proposal, peers])
  const showVoteCommand = proposal.status === ProposalStatus.PENDING

  const handleCloseModal = useCallback(() => {
    dispatch(hideModal())
  }, [dispatch])

  return (
    <PortalModalWrapper id="votes-list-modal" isOpen onClose={handleCloseModal} closeOnOutsideClick>
      <div className="relative mx-16 flex h-fit max-h-[80vh] max-w-[95vw] flex-col gap-16 rounded-12 border border-primary-60 bg-primary-70 px-28 py-32 text-xs sm:text-sm">
        <header className="flex justify-between">
          <h2 className="text-base sm:text-lg">{proposal.title}</h2>
          <button
            type="button"
            className="absolute top-14 ltr:right-14 rtl:left-14"
            onClick={handleCloseModal}
            aria-label="close-button"
          >
            <XmarkIcon className="size-20 text-gray-50" />
          </button>
        </header>

        <div className="flex max-h-[75vh] flex-col justify-between gap-8 overflow-y-scroll px-10">
          <section className="flex max-h-[75vh] flex-col justify-between gap-8">
            {detailsItems.map((item) => (
              <div className="flex flex-col gap-x-12 border-t-1 border-primary-60 p-2 pt-12 lg:flex-row lg:items-center">
                <p className="w-120 text-gray-50">{t(item.i18nKey)}</p>
                {item.content}
              </div>
            ))}
          </section>

          {showVoteCommand && (
            <section className="space-y-10 border-t-1 border-primary-60 pt-16">
              <div className="grid gap-10">
                <p className="mb-2 text-slate-500">{t('home_page.vote_instructions_title')}</p>
                <div className="flex w-full items-center justify-between rounded-md bg-primary-80 p-10">
                  <p className="text-white">{voteCliCommand}</p>
                  <CopyTextButton text={voteCliCommand} />
                </div>
                <div>
                  <p className="text-slate-500">{t('global.notes')}</p>
                  <ul className="ml-18 list-disc text-gray-400">
                    <li>
                      {proposal.proposalIndex} = {t('home_page.proposal_index')}
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-500">{t('global.options')}</p>
                  <ul className="ml-18 list-disc text-gray-400">
                    {proposal.options.map((option) => (
                      <li key={option.index}>
                        <p>
                          {option.index} = {option.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </PortalModalWrapper>
  )
}
