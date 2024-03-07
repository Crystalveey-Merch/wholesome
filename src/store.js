import { configureStore } from "@reduxjs/toolkit";
import openNewMessageModalSlice from "./Features/openNewMessageModalSlice";
import userSlice from "./Features/userSlice";
import usersSlice from "./Features/usersSlice";
import openRightBarSlice from "./Features/openRightBarSlice";
import searchModalSlice from "./Features/searchModalSlice";
import openSideBarSlice from "./Features/openSideBarSlice";

export default configureStore({
  reducer: {
    openNewMessageModal: openNewMessageModalSlice,
    openRightBar: openRightBarSlice,
    user: userSlice,
    users: usersSlice,
    searchModal: searchModalSlice,
    openSideBar: openSideBarSlice,
  },

  devTools: false,
});
