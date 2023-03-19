import { apiSlice } from '../../../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',//auth
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    logout: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/logout',
        method: 'DELETE',
        body: { ...credentials },
        // credentials: 'include'
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApiSlice;
