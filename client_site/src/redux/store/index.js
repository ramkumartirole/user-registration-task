import { configureStore } from '@reduxjs/toolkit';
import EditUserReducer from "../slice/Edit";
import UserDataReducer from "../slice/UserData"

export const store = configureStore({
  reducer: {
   editUser : EditUserReducer,
   userData: UserDataReducer,
  },
});