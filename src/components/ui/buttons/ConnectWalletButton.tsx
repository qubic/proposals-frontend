/* eslint-disable react/jsx-props-no-spreading */
import { LockIcon, UnLockedIcon } from '@app/assets/icons'
import { useAppDispatch, useWalletConnect } from '@app/hooks'
import { ModalType, showModal } from '@app/store/modalSlice'
import { useTranslation } from 'react-i18next'
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
  const dispatch = useAppDispatch()

  const { isWalletConnected } = useWalletConnect()

  const handleShowConnectModal = () => {
    dispatch(showModal({ modalType: ModalType.CONNECT_WALLET }))
  }

  return (
    <Button {...buttonProps} aria-label="Connect Wallet" onClick={handleShowConnectModal}>
      <span className={labelClassName}>
        {isWalletConnected ? t('global.lock_wallet') : t('global.unlock_wallet')}
      </span>
      {showIcon && (isWalletConnected ? <LockIcon /> : <UnLockedIcon />)}
    </Button>
  )
}
