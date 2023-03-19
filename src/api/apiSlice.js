import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials,logOut } from '../redux/features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5001',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.originalStatus === 403) {
        console.log('sending refresh token')
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const username = api.getState().auth.username
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data, username }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            const logout = await baseQuery('/logout', api, extraOptions)
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        // getProducts: builder.query({
        //     query: () => "/products",
        //     keepUnusedDataFor: 5,
        //   }),
    })
})

// export const {useGetProductsQuery}=apiSlice