import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const openSideBarSlice = createSlice({
  name: "openSideBar",
  initialState,
  reducers: {
    openSideBar: (state) => {
      state.open = true;
    },
    closeSideBar: (state) => {
      state.open = false;
    },
    toggleSideBar: (state) => {
      state.open = !state.open;
    },
  },
});

export const { openSideBar, closeSideBar, toggleSideBar } =
  openSideBarSlice.actions;

export const selectOpenSideBar = (state) => state.openSideBar.open;

export default openSideBarSlice.reducer;
