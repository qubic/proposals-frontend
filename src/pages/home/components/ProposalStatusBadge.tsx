import { useTranslation } from 'react-i18next'

import { Badge } from '@app/components/ui'
import type { BadgeColor } from '@app/components/ui/Badge'
import { ProposalStatus } from '@app/store/apis/qli'

type Props = Readonly<{
  status: ProposalStatus
}>

const STATUS_BADGE_MAP: Record<ProposalStatus, { color: BadgeColor; i18nKey: string }> = {
  [ProposalStatus.PENDING]: { color: 'warning', i18nKey: 'global.voting' },
  [ProposalStatus.FAILED]: { color: 'error', i18nKey: 'global.rejected' },
  [ProposalStatus.SUCCESS]: { color: 'success', i18nKey: 'global.approved' },
  [ProposalStatus.CANCELED]: { color: 'error', i18nKey: 'global.cancelled' },
  // This status aren't supported yet. Need to check if we are going to support them in the future
  [ProposalStatus.DRAFT]: {
    color: 'primary',
    i18nKey: ''
  },
  [ProposalStatus.PUBLISHING]: {
    color: 'primary',
    i18nKey: ''
  }
}

export default function ProposalStatusBadge({ status }: Props) {
  const { t } = useTranslation()
  const badgeInfo = STATUS_BADGE_MAP[status]

  if (!badgeInfo?.i18nKey) return null

  return (
    <Badge size="xs" color={badgeInfo.color}>
      {t(badgeInfo.i18nKey)}
    </Badge>
  )
}
