import { Helmet } from 'react-helmet-async';
import { useState,useEffect } from 'react';
// @mui
import { Container, Stack, Typography ,Grid} from '@mui/material/';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products';
// mock
import PRODUCTS from '../../_mock/products';
import AccountProfile from '../../sections/@dashboard/account/AccountProfile';
import { AccountProfileDetails } from '../../sections/@dashboard/account/AccountProfileDetails';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentEmail, selectCurrentUser, setCredentials, updateUserAvatar } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';
import { USERS_URL } from '../../Constants';

// ----------------------------------------------------------------------

export default function AdminProfile() {
  const userExist = useSelector(selectCurrentUser);
  const [user, setUser] = useState(userExist);
  const api = useAxios();
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    const response = await api.get(`/api/users/current`);
    console.log(response.data.user);
    setUser(response.data.user);
    dispatch(updateUserAvatar(response.data.user.avatar));
  };


  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <Helmet>
        <title> Profile</title>
      </Helmet>
      <Container>
         <Stack spacing={3}>
          <div>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Profile
            </Typography>
          </div>
          <div>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} lg={4}>
                <AccountProfile user={user} getCurrentUser={getCurrentUser} setUser={setUser} />
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <AccountProfileDetails user={user}  getCurrentUser={getCurrentUser} setUser={setUser}/>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </>
  )

}
