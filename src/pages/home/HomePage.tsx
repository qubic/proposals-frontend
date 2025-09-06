import { useCallback, useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { Button, ConnectWalletButton } from '@app/components/ui/buttons'
import { isConnectWalletEnabled } from '@app/configs'
import { useWalletConnect } from '@app/hooks'
import { PrivateRoutes } from '@app/router'
import {
  useGetActiveProposalsQuery,
  useGetEndedProposalsQuery,
  useGetEpochHistoryQuery,
  useGetPeersQuery
} from '@app/store/apis/qli'
import { useGetLatestStatsQuery } from '@app/store/apis/qubic-rpc.api'
import { EpochPagination, ProposalsList, ProposalsTabs } from './components'
import type { TabKey } from './components/ProposalsTabs'
import { PROPOSALS_TABS } from './constants'

export default function HomePage() {
  const { isWalletConnected } = useWalletConnect()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const proposalStatus = (searchParams.get('status') as TabKey) || PROPOSALS_TABS[0].i18nKey
  const epochParam = searchParams.get('epoch')

  const isActiveProposalsTab = useMemo(
    () => proposalStatus === 'active_proposals',
    [proposalStatus]
  )

  const activeProposals = useGetActiveProposalsQuery()
  const endedProposals = useGetEndedProposalsQuery(undefined, { skip: isActiveProposalsTab })
  const peers = useGetPeersQuery()
  const { data: latestStats } = useGetLatestStatsQuery()

  const defaultEpoch = latestStats?.epoch ? latestStats.epoch - 1 : 0
  const currentEpoch = epochParam ? parseInt(epochParam, 10) : defaultEpoch

  const epochHistory = useGetEpochHistoryQuery(currentEpoch, {
    skip: isActiveProposalsTab || Number.isNaN(currentEpoch)
  })

  const handleOnTabClick = useCallback(
    (tab: TabKey) => {
      const newParams: Record<string, string> = { status: tab }
      if (tab === 'ended_proposals' && !epochParam && latestStats?.epoch) {
        newParams.epoch = (latestStats.epoch - 1).toString()
      }
      setSearchParams(newParams)
    },
    [setSearchParams, epochParam, latestStats?.epoch]
  )

  const handleEpochChange = useCallback(
    (epoch: number) => {
      const newParams: Record<string, string> = { status: proposalStatus }
      if (epoch !== defaultEpoch) {
        newParams.epoch = epoch.toString()
      }
      setSearchParams(newParams)
    },
    [setSearchParams, proposalStatus, defaultEpoch]
  )

  useEffect(() => {
    if (!searchParams.has('status')) {
      setSearchParams({ status: PROPOSALS_TABS[0].i18nKey }, { replace: true })
    } else if (!isActiveProposalsTab && !epochParam && latestStats?.epoch) {
      setSearchParams(
        {
          status: proposalStatus,
          epoch: (latestStats.epoch - 1).toString()
        },
        { replace: true }
      )
    }
  }, [
    isActiveProposalsTab,
    endedProposals.data,
    searchParams,
    setSearchParams,
    epochParam,
    latestStats?.epoch,
    proposalStatus
  ])

  return (
    <div className="w-full pb-72 pt-60 lg:pt-120">
      <div className="mx-auto flex w-fit flex-1 flex-col justify-center gap-80 lg:flex-row">
        <section className="mx-auto grid h-fit max-w-[416px] place-items-center gap-24 lg:place-items-start">
          <h1 className="text-center text-32 lg:text-start">
            <Trans
              i18nKey="home_page.title"
              components={{ bold: <span className="text-primary-30" /> }}
            />
          </h1>
          <p className="text-center text-gray-50 lg:text-start">{t('home_page.description')}</p>
          {isConnectWalletEnabled &&
            (isWalletConnected ? (
              <Button as={Link} to={PrivateRoutes.PROPOSALS.CREATE}>
                {t('home_page.create_proposal')}
              </Button>
            ) : (
              <ConnectWalletButton size="sm" className="w-fit" />
            ))}
        </section>

        <section className="flex flex-col gap-16 sm:w-screen sm:max-w-[530px] lg:max-w-[652px]">
          <ProposalsTabs activeTab={proposalStatus} onTabClick={handleOnTabClick} />
          {!isActiveProposalsTab && latestStats?.epoch && (
            <EpochPagination
              currentEpoch={currentEpoch}
              latestEpoch={latestStats.epoch}
              onEpochChange={handleEpochChange}
              isLoading={epochHistory.isFetching}
            />
          )}
          <ProposalsList
            proposals={isActiveProposalsTab ? activeProposals.data : epochHistory.data?.result}
            isFetching={isActiveProposalsTab ? activeProposals.isFetching : epochHistory.isFetching}
            isError={isActiveProposalsTab ? activeProposals.isError : epochHistory.isError}
            noDataMessage={t(
              isActiveProposalsTab
                ? 'home_page.no_active_proposals'
                : 'home_page.no_ended_proposals'
            )}
            errorMessage={t('home_page.error_fetching_proposals')}
            peers={peers.data ?? []}
          />
        </section>
      </div>
    </div>
  )
}
