import { Button } from '@app/components/ui/buttons'
import { clsxTwMerge } from '@app/utils'
import { PROPOSALS_MOCK } from '@app/utils/mocks'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ProposalCard } from './components'

const TABS = [{ i18nKey: 'active_proposals' }, { i18nKey: 'ended_proposals' }] as const

type TabKey = (typeof TABS)[number]['i18nKey']

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabKey>(TABS[0].i18nKey)
  const { t } = useTranslation()

  const handleOnTabClick = (tab: TabKey) => {
    setActiveTab(tab)
  }

  return (
    <div className="w-full pb-72 pt-60 lg:pt-120">
      <div className="mx-auto flex w-fit flex-1 flex-col gap-80 lg:flex-row">
        <section className="grid h-fit max-w-[416px] place-items-center gap-24 lg:place-items-start">
          <h1 className="text-center text-32 lg:text-start">
            <Trans
              i18nKey="home_page.title"
              components={{ bold: <span className="text-primary-30" /> }}
            />
          </h1>
          <p className="text-center text-gray-50 lg:text-start">{t('home_page.description')}</p>
          <Button size="sm">{t('global.unlock_wallet')}</Button>
        </section>
        <section className="flex flex-col gap-16">
          <ul className="flex gap-x-20">
            {TABS.map((tab) => (
              <li key={tab.i18nKey}>
                <button
                  type="button"
                  onClick={() => handleOnTabClick(tab.i18nKey)}
                  className={clsxTwMerge(
                    'cursor-pointer text-20',
                    activeTab === tab.i18nKey ? 'text-primary-30' : 'text-gray-50'
                  )}
                >
                  {t(`home_page.${tab.i18nKey}`)}
                </button>
              </li>
            ))}
          </ul>
          <ul className="grid gap-24">
            {PROPOSALS_MOCK.map((proposal) => (
              <li key={proposal.id}>
                <ProposalCard title={proposal.title} details={proposal.details} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
