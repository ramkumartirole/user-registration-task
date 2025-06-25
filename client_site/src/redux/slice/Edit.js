// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const EditUserSlice = createSlice({
  name: 'editUser',
  initialState: {
    editUser: "", // ⬅️ array to store data
  },
  reducers: {
    setEditUser: (state, action) => {
      state.editUser = (action.payload);
    },
     clearEditUser: (state, action) => {
      state.editUser =""
    },
  },
});

export const { setEditUser, clearEditUser } = EditUserSlice.actions;
export default EditUserSlice.reducer;
