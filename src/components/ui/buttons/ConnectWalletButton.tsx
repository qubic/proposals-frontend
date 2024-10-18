/* eslint-disable react/jsx-props-no-spreading */
import { LockIcon, UnLockedIcon } from '@app/assets/icons'
import { useQubicWallet } from '@app/hooks'
import { useTranslation } from 'react-i18next'
import { ConnectWalletModal } from '../modals'
import Button, { type ButtonProps } from './Button'

type ConnectWalletButtonProps = Omit<ButtonProps, 'onClick' | 'children'> & {
  showIcon?: boolean
  labelClassName?: string
}

export default function ConnectWalletButton({
  labelClassName,
  showIcon = false,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const { t } = useTranslation()
  const { isWalletConnected, toggleConnectModal } = useQubicWallet()

  return (
    <>
      <Button {...buttonProps} aria-label="Connect Wallet" onClick={toggleConnectModal}>
        <span className={labelClassName}>
          {isWalletConnected ? t('global.lock_wallet') : t('global.unlock_wallet')}
        </span>
        {showIcon && (isWalletConnected ? <LockIcon /> : <UnLockedIcon />)}
      </Button>
      <ConnectWalletModal />
    </>
  )
}
