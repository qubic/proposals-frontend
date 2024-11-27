import { Tooltip } from '@app/components/ui'
import { CopyTextButton } from '@app/components/ui/buttons'
import { EXPLORER_URL } from '@app/constants/urls'
import { clsxTwMerge, formatEllipsis } from '@app/utils'
import { useMemo } from 'react'

type Props = {
  address: string
  label?: string
  copy?: boolean
  ellipsis?: boolean
  className?: string
  showTooltip?: boolean
}

const makeExplorerAddressUrl = (address: string) => `${EXPLORER_URL}/network/address/${address}`

export default function ExplorerAddressLink({
  address,
  label,
  className,
  copy = false,
  ellipsis = false,
  showTooltip = false
}: Props) {
  const addressLink = useMemo(() => {
    const getDisplayValue = () => {
      if (label) {
        return label
      }
      if (ellipsis) {
        return formatEllipsis(address)
      }
      return address
    }

    return (
      <div className="flex items-center gap-10">
        <a
          role="button"
          className={clsxTwMerge(
            'break-all font-space text-xs text-primary-30 xs:text-sm',
            className
          )}
          href={makeExplorerAddressUrl(address)}
          target="_blank"
          rel="noreferrer"
        >
          {getDisplayValue()}
        </a>
        {copy && <CopyTextButton text={address} />}
      </div>
    )
  }, [className, address, copy, label, ellipsis])

  return showTooltip ? <Tooltip content={address}>{addressLink}</Tooltip> : addressLink
}
