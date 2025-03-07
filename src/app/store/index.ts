import { configureStore } from "@reduxjs/toolkit";
import userLoginReducer from "@/app/login/loginSlice";

export const store = configureStore({
  reducer: { user: userLoginReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
