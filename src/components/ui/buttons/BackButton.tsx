import { ArrowLeftIcon } from '@app/assets/icons'
import { PublicRoutes } from '@app/router'
import { clsxTwMerge } from '@app/utils'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = {
  className?: string
  onClick?: () => void
  children?: React.ReactNode
  disabled?: boolean
  ariaLabel?: string
  fallbackUrl?: string
}

export default function BackButton({
  className,
  onClick,
  children,
  disabled = false,
  ariaLabel = 'go back',
  fallbackUrl = PublicRoutes.HOME
}: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoBack = () => {
    if (typeof onClick === 'function') {
      onClick()
    } else if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(fallbackUrl)
    }
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={clsxTwMerge(
        "disabled:cursor-not-allowed' text-[#B7BABC] disabled:opacity-50",
        className
      )}
      onClick={handleGoBack}
      disabled={disabled}
    >
      <ArrowLeftIcon />
      {children}
    </button>
  )
}
