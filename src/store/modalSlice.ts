import type { VotesListModalProps } from '@app/components/modals/VotesListModal'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@app/store'

export enum ModalType {
  NONE = 'NONE',
  CONNECT_WALLET = 'CONNECT_WALLET',
  VOTES_LIST = 'VOTES_LIST'
}

type ModalProps = {
  [ModalType.VOTES_LIST]: VotesListModalProps
  [ModalType.CONNECT_WALLET]: undefined
  [ModalType.NONE]: undefined
}

export interface ModalState {
  modalType: ModalType
  modalProps?: ModalProps[ModalType]
}

const initialState: ModalState = {
  modalType: ModalType.NONE
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
    hideModal: (state) => {
      state.modalType = ModalType.NONE
      state.modalProps = undefined
    }
  }
})

export const selectModal = (state: RootState) => state.modal

export const { showModal, hideModal } = modalSlice.actions

export default modalSlice.reducer
