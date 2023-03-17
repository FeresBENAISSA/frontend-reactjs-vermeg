import useAxios from "./axios";
const PRODUCT_URL='/products';
// const getProducts= ()=>{
//    api.get('/products').then(
//     (response)=>console.log(response)
//    ).catch((err)=>console.log(err))
  
//   // console.log(response)
// }

export const getProducts = async (api) => {

    try {
      const response = await api.get(PRODUCT_URL);

      if (!response?.data) throw Error('no data found');
      const products = response.data;
      console.log(products);
      return products;
    } catch (error) {
      console.log(error);
    }  
   
  };

