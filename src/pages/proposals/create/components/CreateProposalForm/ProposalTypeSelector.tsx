import { BitcoinIcon, CoinsIcon, JsonIcon, PresentIcon } from '@app/assets/icons'
import { ProposalType } from '@app/types/enums'
import { clsxTwMerge } from '@app/utils'
import type { UseFormSetValue } from 'react-hook-form'
import type { ProposalFormData } from '../../schemas/proposal.schema'

const PROPOSAL_TYPES = {
  [ProposalType.GENERAL_PROPOSAL]: {
    icon: BitcoinIcon,
    i18nKey: 'general_proposal',
    value: ProposalType.GENERAL_PROPOSAL
  },
  [ProposalType.COMPUTOR_DONATION]: {
    icon: PresentIcon,
    i18nKey: 'computor_donation',
    value: ProposalType.COMPUTOR_DONATION
  },
  [ProposalType.CCF_FUNDING_REQUEST]: {
    icon: CoinsIcon,
    i18nKey: 'ccf_funding_proposal',
    value: ProposalType.CCF_FUNDING_REQUEST
  },
  [ProposalType.SHAREHOLDER_PROPOSAL]: {
    icon: JsonIcon,
    i18nKey: 'shareholder_proposal',
    value: ProposalType.SHAREHOLDER_PROPOSAL
  }
} as const

type Props = {
  selectedProposalType: ProposalType
  setValue: UseFormSetValue<ProposalFormData>
  t: (key: string) => string
}

export default function ProposalTypeSelector({ selectedProposalType, setValue, t }: Props) {
  return (
    <section>
      <ul className="grid gap-16 lg:grid-flow-col">
        {Object.values(PROPOSAL_TYPES).map((proposalType) => {
          const isSelected = selectedProposalType === proposalType.value
          return (
            <li
              key={proposalType.value}
              className={clsxTwMerge(
                'rounded-12 border bg-primary-70',
                isSelected ? 'border-primary-30' : 'border-primary-60'
              )}
            >
              <button
                type="button"
                onClick={() => setValue('proposalType', proposalType.value)}
                className="flex size-full items-center gap-16 px-20 py-24 lg:grid lg:size-[138px] lg:grid-flow-row lg:place-items-center lg:gap-8 lg:px-8 lg:py-16"
              >
                <proposalType.icon
                  className={clsxTwMerge(
                    'size-24 shrink-0 lg:size-32',
                    isSelected ? 'text-primary-30' : 'text-slate-500'
                  )}
                />
                <span className={isSelected ? 'text-primary-30' : 'text-white'}>
                  {t(`create_proposal_page.${proposalType.i18nKey}`)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
