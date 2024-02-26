import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchModal: false,
};

const searchModalSlice = createSlice({
  name: "searchModal",
  initialState,
  reducers: {
    openSearchModal: (state) => {
      state.searchModal = true;
    },
    closeSearchModal: (state) => {
      state.searchModal = false;
    },
  },
});

export const { openSearchModal, closeSearchModal } = searchModalSlice.actions;

export const selectSearchModal = (state) => state.searchModal.searchModal;

export default searchModalSlice.reducer;
