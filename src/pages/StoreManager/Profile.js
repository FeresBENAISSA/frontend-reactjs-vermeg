import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Stack, Typography, Grid } from '@mui/material/';
// components
// mock
import AccountProfile from '../../sections/@dashboard/account/AccountProfile';
import { AccountProfileDetails } from '../../sections/@dashboard/account/AccountProfileDetails';
import { useDispatch, useSelector } from 'react-redux';
import {  selectCurrentUser, updateUserAvatar } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';
import { USERS_URL } from '../../Constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------------------

export default function ManagerProfile() {
  // const baseuser = useSelector(selectCurrentUser);
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
  const handleApiResponse = (response) => {
    console.log("here")
    if (response.status === 201) {
      toast.success("Uploaded successfully");
    } else {
      toast.error('Error occured');
    }
  };

  // if (user)
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
              <Grid item xs={12} md={6} lg={4}>
                <AccountProfile user={user} getCurrentUser={getCurrentUser} setUser={setUser} handleApiResponse={handleApiResponse}/>
              </Grid>
              <Grid item xs={12} md={6} lg={8}>
                <AccountProfileDetails user={user} updateUser={updateUser} getCurrentUser={getCurrentUser} setUser={setUser}/>
              </Grid>
            </Grid>
          </div>
        </Stack>
        <ToastContainer position='bottom-right'  />

      </Container>
    </>
  );
}
