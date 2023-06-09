import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    email: null,
    token: null,
    user:null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, accessToken ,user} = action.payload;
      state.email = email;
      state.token = accessToken;
      state.user=user;
    },
    updateUserAvatar:(state, action) => {
    state.user.avatar=action.payload;
    },
    logOut: (state, action) => {
      state.email = null;
      state.token = null;
      state.user=null;
    },
  },
});

export const { setCredentials, logOut,updateUserAvatar } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentEmail = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.user?.roles;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUsername = (state) => state.auth.user?.username;


