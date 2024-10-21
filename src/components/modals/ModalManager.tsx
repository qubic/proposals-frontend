import { useAppSelector } from '@app/hooks'
import { ModalType, selectModalType } from '@app/store/modalSlice'

import { ConnectWalletModal } from './ConnectWalletModal'

export default function ModalManager() {
  const modalType = useAppSelector(selectModalType)

  switch (modalType) {
    case ModalType.CONNECT_WALLET:
      return <ConnectWalletModal />

    case ModalType.NONE:
    default:
      return null
  }
}
