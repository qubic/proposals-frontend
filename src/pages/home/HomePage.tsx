import { useCallback, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button, ConnectWalletButton } from '@app/components/ui/buttons'
import { isConnectWalletEnabled } from '@app/configs'
import { useWalletConnect } from '@app/hooks'
import { PrivateRoutes } from '@app/router'
import { useGetActiveProposalsQuery, useGetEndedProposalsQuery } from '@app/store/apis/qli'
import { ProposalsList, ProposalsTabs } from './components'
import type { TabKey } from './components/ProposalsTabs'
import { PROPOSALS_TABS } from './constants'

export default function HomePage() {
  const { isWalletConnected } = useWalletConnect()
  const [activeTab, setActiveTab] = useState<TabKey>(PROPOSALS_TABS[0].i18nKey)
  const { t } = useTranslation()

  const isActiveProposalsTab = useMemo(() => activeTab === 'active_proposals', [activeTab])

  const {
    data: activeProposals,
    isFetching: isActiveProposalsFetching,
    isError: isActiveProposalsError
  } = useGetActiveProposalsQuery()
  const {
    data: endedProposals,
    isFetching: isEndedProposalsFetching,
    isError: isEndedProposalsError
  } = useGetEndedProposalsQuery(undefined, { skip: isActiveProposalsTab })

  const handleOnTabClick = useCallback((tab: TabKey) => {
    setActiveTab(tab)
  }, [])

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
          <ProposalsTabs activeTab={activeTab} onTabClick={handleOnTabClick} />
          <ProposalsList
            proposals={isActiveProposalsTab ? activeProposals : endedProposals?.result}
            isFetching={isActiveProposalsTab ? isActiveProposalsFetching : isEndedProposalsFetching}
            isError={isActiveProposalsTab ? isActiveProposalsError : isEndedProposalsError}
            noDataMessage={t(
              isActiveProposalsTab
                ? 'home_page.no_active_proposals'
                : 'home_page.no_ended_proposals'
            )}
            errorMessage={t('home_page.error_fetching_proposals')}
          />
        </section>
      </div>
    </div>
  )
}
