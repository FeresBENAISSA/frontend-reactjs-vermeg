import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    username: null,
    token: null,
    roles:[]
  },
  reducers: {
    setCredentials: (state, action) => {
      const { username, accessToken,roles } = action.payload;
      state.username = username;
      state.token = accessToken;
      state.roles=roles;
    },
    logOut: (state, action) => {
      state.username = null;
      state.token = null;
      state.roles= []
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUsername = (state) => state.auth.username;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.roles;

