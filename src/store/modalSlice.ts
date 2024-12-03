import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { ProposalDetailsModalProps } from '@app/components/modals/ProposalDetailsModal'
import type { VotesListModalProps } from '@app/components/modals/VotesListModal'
import type { RootState } from '@app/store'

export enum ModalType {
  NONE = 'NONE',
  CONNECT_WALLET = 'CONNECT_WALLET',
  VOTES_LIST = 'VOTES_LIST',
  PROPOSAL_DETAILS = 'PROPOSAL_DETAILS'
}

export type ModalProps = {
  [ModalType.NONE]: undefined
  [ModalType.CONNECT_WALLET]: undefined
  [ModalType.VOTES_LIST]: VotesListModalProps
  [ModalType.PROPOSAL_DETAILS]: ProposalDetailsModalProps
}

export interface ModalState {
  modalType: ModalType
  modalProps?: ModalProps[ModalType]
}

const initialState: ModalState = {
  modalType: ModalType.NONE,
  modalProps: undefined
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: <T extends ModalType>(
      state: ModalState,
      action: PayloadAction<{ modalType: T; modalProps?: ModalProps[T] }>
    ) => {
      state.modalType = action.payload.modalType
      state.modalProps = action.payload.modalProps
    },
    hideModal: () => initialState
  }
})

export const selectModal = (state: RootState) => state.modal

export const { showModal, hideModal } = modalSlice.actions

export default modalSlice.reducer
