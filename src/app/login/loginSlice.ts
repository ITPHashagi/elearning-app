import { createSlice } from "@reduxjs/toolkit";

const storedUser =
  typeof window !== "undefined" ? localStorage.getItem("userInfor") : null;

const initialState = storedUser ? JSON.parse(storedUser) : null;

const userLoginSlice = createSlice({
  name: "userLoginSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: () => ({ user: null }),
  },
});

export const { setUser, logout } = userLoginSlice.actions;
export default userLoginSlice.reducer;
