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
import { selectCurrentEmail, selectCurrentUser, updateUserAvatar } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';
import { USERS_URL } from '../../Constants';

// ----------------------------------------------------------------------

export default function BankProfile() {
  const email = useSelector(selectCurrentEmail);
  // const baseuser = useSelector(selectCurrentUser);
  const userExist = useSelector(selectCurrentUser);
  const [user, setUser] = useState(userExist);
  const api = useAxios();
  const dispatch = useDispatch();

  // const getUserByEmail = async (email) => {
  //   const response = await api.get(`/api/users/${email}`);
  //   console.log(response);
  //   setUser(response.data.user);
  // };

  const getCurrentUser = async () => {
    const response = await api.get(`/api/users/current`);
    console.log(response.data.user);
    setUser(response.data.user);
    dispatch(updateUserAvatar(response.data.user.avatar));
  };
  // const getCurrentUser = async () => {
  //   const response = await api.get(`/api/users/current`);
  //   console.log(response);
  //   setUser(response.data.user);
  // };

  const updateUser = async (values) => {
    const response = await api.put(USERS_URL, values);
    setUser(response.data.user);
    // console.log(response);
    // getUserByEmail(email);
    getCurrentUser();
  };
  useEffect(() => {
    // console.log(user);
    // getUserByEmail(email);
    getCurrentUser();
  }, []);



  return (
    <>
      <Helmet>
        <title> Bank Profile</title>
      </Helmet>

      <Container>
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography> */}

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        <ProductCartWidget /> */}
       
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
                <AccountProfileDetails user={user} updateUser={updateUser} getCurrentUser={getCurrentUser} setUser={setUser}/>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </>
  )
 
}
