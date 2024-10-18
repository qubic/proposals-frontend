/* eslint-disable react/jsx-props-no-spreading */
import { LockIcon, UnLockedIcon } from '@app/assets/icons'
import { useQubicWallet } from '@app/hooks'
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
  const { isWalletConnected, toggleConnectModal } = useQubicWallet()

  return (
    <>
      <Button {...buttonProps} aria-label="Connect Wallet" onClick={toggleConnectModal}>
        <span className={labelClassName}>
          {isWalletConnected ? 'Lock Wallet' : 'Unlock Wallet'}
        </span>
        {showIcon && (isWalletConnected ? <LockIcon /> : <UnLockedIcon />)}
      </Button>
      <ConnectWalletModal />
    </>
  )
}
