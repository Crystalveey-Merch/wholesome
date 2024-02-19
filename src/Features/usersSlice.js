import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = state.users.map((user) => {
        if (user.id === action.payload.id) {
          return { ...user, ...action.payload };
        }
        return user;
      });
    },
  },
});

export const { setUsers, updateUsers } = usersSlice.actions;

export const selectUsers = (state) => state.users.users;

export default usersSlice.reducer;
