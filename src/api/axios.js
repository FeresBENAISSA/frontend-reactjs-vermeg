import axios from 'axios';
import dayjs  from 'dayjs';
import jwt_decode  from 'jwt-decode';
import { defaultThemes } from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentToken, selectCurrentUsername, setCredentials } from '../redux/features/auth/authSlice';

const baseUrl = 'http://localhost:3001';
axios.defaults.withCredentials = true

const useAxios = () => {
  const token = useSelector(selectCurrentToken);
  const username = useSelector(selectCurrentUsername)
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
    const response = await axios.get(`${baseUrl}/refresh`);
    console.log(response)

    if(response?.data){
      dispatch(setCredentials({ ...response.data, username }));
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
