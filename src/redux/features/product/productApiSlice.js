import { createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../../api/apiSlice';


const productAdapter = createEntityAdapter()

const initialState = productAdapter.getInitialState()



export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      keepUnusedDataFor: 5,
    }),
    addProduct: builder.mutation({
      query:(product)=>({
        url:"/products",
        method:'POST',
        body:product
      })
    }),
    updateProduct: builder.mutation({
      query:(product)=>({
        url:"/products",
        method:"PUT",
        body:product
      })
    }),
    deleteProduct: builder.mutation({
      query:({id})=>({
        url:`/products/${id}`,
        method:"DELETE",
        body:id
      })
    }),
  }),
});

export const  {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,

} = productsApiSlice;
