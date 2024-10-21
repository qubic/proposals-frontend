import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export enum ModalType {
  NONE = 'NONE',
  CONNECT_WALLET = 'CONNECT_WALLET'
}

export interface ModalState {
  modalType: ModalType
  modalProps?: unknown
}

const initialState: ModalState = {
  modalType: ModalType.NONE
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, action: PayloadAction<{ modalType: ModalType; modalProps?: unknown }>) => {
      state.modalType = action.payload.modalType
      state.modalProps = action.payload.modalProps
    },
    hideModal: (state) => {
      state.modalType = ModalType.NONE
      state.modalProps = undefined
    }
  }
})

export const selectModalType = (state: { modal: ModalState }) => state.modal.modalType

export const { showModal, hideModal } = modalSlice.actions

export default modalSlice.reducer
