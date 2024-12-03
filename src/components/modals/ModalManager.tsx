/* eslint-disable react/jsx-props-no-spreading */
import { useAppSelector } from '@app/hooks'
import type { ModalProps, ModalState } from '@app/store/modalSlice'
import { ModalType, selectModal } from '@app/store/modalSlice'

import { ConnectWalletModal } from './ConnectWalletModal'
import ProposalDetailsModal from './ProposalDetailsModal'
import VotesListModal from './VotesListModal'

function isValidModalProps<T extends ModalType>(
  modalType: T,
  modalProps: ModalState['modalProps']
): modalProps is ModalProps[T] {
  switch (modalType) {
    case ModalType.VOTES_LIST:
      return !!modalProps && 'votes' in modalProps
    case ModalType.PROPOSAL_DETAILS:
      return !!modalProps && 'proposal' in modalProps
    case ModalType.CONNECT_WALLET:
    case ModalType.NONE:
      return true
    default:
      return false
  }
}

export default function ModalManager() {
  const { modalType, modalProps } = useAppSelector(selectModal)

  if (!isValidModalProps(modalType, modalProps)) {
    // eslint-disable-next-line no-console
    console.error(`Invalid modal props for modal type: ${modalType}. Props: ${modalProps}`)
    return null
  }

  switch (modalType) {
    case ModalType.CONNECT_WALLET:
      return <ConnectWalletModal />

    case ModalType.VOTES_LIST:
      return <VotesListModal {...(modalProps as ModalProps[ModalType.VOTES_LIST])} />

    case ModalType.PROPOSAL_DETAILS:
      return <ProposalDetailsModal {...(modalProps as ModalProps[ModalType.PROPOSAL_DETAILS])} />

    case ModalType.NONE:
    default:
      return null
  }
}
