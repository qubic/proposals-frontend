import { useAppSelector } from '@app/hooks'
import { ModalType, selectModal } from '@app/store/modalSlice'

import { ConnectWalletModal } from './ConnectWalletModal'
import VotesListModal from './VotesListModal'

export default function ModalManager() {
  const { modalType, modalProps } = useAppSelector(selectModal)

  switch (modalType) {
    case ModalType.CONNECT_WALLET:
      return <ConnectWalletModal />

    case ModalType.VOTES_LIST:
      return modalProps && <VotesListModal votes={modalProps.votes} />

    case ModalType.NONE:
    default:
      return null
  }
}
