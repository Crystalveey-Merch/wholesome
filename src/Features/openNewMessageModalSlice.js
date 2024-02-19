import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const openNewMessageModalSlice = createSlice({
  name: "openNewMessageModal",
  initialState,
  reducers: {
    openNewMessageModal: (state) => {
      state.open = true;
    },
    closeNewMessageModal: (state) => {
      state.open = false;
    },
  },
});

export const { openNewMessageModal, closeNewMessageModal } =
  openNewMessageModalSlice.actions;

export const selectOpenNewMessageModal = (state) =>
  state.openNewMessageModal.open;

export default openNewMessageModalSlice.reducer;
