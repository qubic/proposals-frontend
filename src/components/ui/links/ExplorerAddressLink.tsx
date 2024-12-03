import { useMemo } from 'react'

import { Tooltip } from '@app/components/ui'
import { CopyTextButton } from '@app/components/ui/buttons'
import { EXPLORER_URL } from '@app/constants/urls'
import { clsxTwMerge, formatEllipsis } from '@app/utils'

type Props = {
  value: string
  label?: string | React.ReactNode
  copy?: boolean
  ellipsis?: boolean
  className?: string
  showTooltip?: boolean
  tooltipContent?: string
}

const makeExplorerAddressUrl = (address: string) => `${EXPLORER_URL}/network/address/${address}`

export default function ExplorerAddressLink({
  value,
  label,
  className,
  copy = false,
  ellipsis = false,
  showTooltip = false,
  tooltipContent = value
}: Props) {
  const txLink = useMemo(() => {
    const getDisplayValue = () => {
      if (label) {
        return label
      }
      if (ellipsis) {
        return formatEllipsis(value)
      }
      return value
    }

    return (
      <div className="flex w-fit items-center gap-10">
        <a
          className={clsxTwMerge(
            'break-all font-space text-xxs text-primary-30 xs:text-xs',
            className
          )}
          href={makeExplorerAddressUrl(value)}
          target="_blank"
          rel="noreferrer"
        >
          {getDisplayValue()}
        </a>
        {copy && <CopyTextButton text={value} />}
      </div>
    )
  }, [className, value, copy, label, ellipsis])

  return showTooltip ? <Tooltip content={tooltipContent}>{txLink}</Tooltip> : txLink
}
