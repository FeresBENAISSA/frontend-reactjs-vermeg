
import React from 'react';
import axios from '../../../api/axios';


const PRODUCT_URL = '/products';

const createProduct = async (values,token) => {
  const response = await axios.post(PRODUCT_URL, values, 
    {
    headers: { Authorization: `Bearer ${token}`, roles: ['ADMIN', 'STORE_MANAGER'] },
  });
};
const fetchProducts = async (setData,token) => {
  try {
    const response = await axios.get(PRODUCT_URL, {
      headers: { Authorization: `Bearer ${token}`, roles: ['ADMIN', 'STORE_MANAGER'] },
    });
    if (!response?.data) throw Error('no data found');
    const products = response.data;
    console.log(products);
    setData(products);
  } catch (error) {
    console.log(error);
  }
};
export   {createProduct,fetchProducts};


// export const = {
//   fetchProducts,
//   createProduct
// } ;

// export default{
//     fetchProducts,
//     createProduct
// } ;
