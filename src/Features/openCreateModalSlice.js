import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const openCreateModalSlice = createSlice({
  name: "openCreateModal",
  initialState,
  reducers: {
    openCreateModal: (state) => {
      state.open = true;
    },
    closeCreateModal: (state) => {
      state.open = false;
    },
  },
});

export const { openCreateModal, closeCreateModal } =
  openCreateModalSlice.actions;

export const selectOpenCreateModal = (state) => state.openCreateModal.open;

export default openCreateModalSlice.reducer;
