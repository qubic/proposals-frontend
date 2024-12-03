import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { clsxTwMerge } from '@app/utils'
import { PROPOSALS_TABS } from '../constants'

export type TabKey = (typeof PROPOSALS_TABS)[number]['i18nKey']

type Props = Readonly<{
  activeTab: TabKey
  onTabClick: (tab: TabKey) => void
}>

function ProposalsTabs({ activeTab, onTabClick }: Props) {
  const { t } = useTranslation()

  return (
    <ul className="flex gap-x-20">
      {PROPOSALS_TABS.map((tab) => (
        <li key={tab.i18nKey}>
          <button
            type="button"
            onClick={() => onTabClick(tab.i18nKey)}
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
  )
}

const MemoizedProposalsTabs = memo(ProposalsTabs)

export default MemoizedProposalsTabs
