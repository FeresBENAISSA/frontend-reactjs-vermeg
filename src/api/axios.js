import { Select } from '@mui/material';
import axios from 'axios';
import dayjs  from 'dayjs';
import jwt_decode  from 'jwt-decode';
import { defaultThemes } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { logOut,selectCurrentUsername, selectCurrentEmail,selectCurrentUser ,selectCurrentToken, setCredentials } from '../redux/features/auth/authSlice';

const baseUrl = 'http://localhost:5001';
axios.defaults.withCredentials = true

const useAxios = () => {
  const token = useSelector(selectCurrentToken);
  const email = useSelector(selectCurrentEmail)
  const user = useSelector(selectCurrentUser);
  const username = useSelector(selectCurrentUsername);
  const dispatch=useDispatch();
  // console.log(token);
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: { Authorization: `Bearer ${token}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    
    const payload = jwt_decode(token);
    // console.log(payload)
    const isExpired = dayjs.unix(payload.exp).diff(dayjs()) < 1;
    if (!isExpired) return req;
    console.log("refreshing token ")
    const response = await axios.get(`${baseUrl}/api/auth/getNewToken`);

    if(response?.data){
      const accessToken= response.data.accessToken;
      dispatch(setCredentials({ email,accessToken,user  } ));
      req.headers.Authorization=`Bearer ${response.data.accessToken}`;
    }
    return req;
  });

  return axiosInstance;
};

export default useAxios;

// export default
// axios.defaults.withCredentials = true
// https://fakestoreapi.com
