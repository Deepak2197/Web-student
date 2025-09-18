import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profilename: "",

};

const profileSlice = createSlice({
  name: "profileName",
  initialState,
  reducers: {
      userinfo: (state, action) => {
          state.profilename=action.payload
      }
  },
});

export const { userinfo,clearUserinfo } = profileSlice.actions;
export default profileSlice.reducer;