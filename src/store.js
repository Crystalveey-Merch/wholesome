import { configureStore } from "@reduxjs/toolkit";
import openNewMessageModalSlice from "./Features/openNewMessageModalSlice";
import userSlice from "./Features/userSlice";
import usersSlice from "./Features/usersSlice";

export default configureStore({
  reducer: {
    openNewMessageModal: openNewMessageModalSlice,
    user: userSlice,
    users: usersSlice,
  },
});
