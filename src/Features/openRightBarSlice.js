import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const openRightBarSlice = createSlice({
  name: "openRightBar",
  initialState,
  reducers: {
    openRightBar: (state) => {
      state.open = true;
    },
    closeRightBar: (state) => {
      state.open = false;
    },
  },
});

export const { openRightBar, closeRightBar } = openRightBarSlice.actions;

export const selectOpenRightBar = (state) => state.openRightBar.open;

export default openRightBarSlice.reducer;
