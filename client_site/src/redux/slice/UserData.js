// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const UserUserSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: [], // ⬅️ array to store data
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = (action.payload);
    },
     clearUserData: (state, action) => {
      state.userData =[]
    },
  },
});

export const { setUserData, clearUserData} = UserUserSlice.actions;
export default UserUserSlice.reducer;
