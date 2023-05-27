import { Helmet } from 'react-helmet-async';
import { useState,useEffect } from 'react';
// @mui
import { Container, Stack, Typography ,Grid} from '@mui/material/';
// components
import AccountProfile from '../../sections/@dashboard/account/AccountProfile';
import { AccountProfileDetails } from '../../sections/@dashboard/account/AccountProfileDetails';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateUserAvatar } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const handleApiResponse = (response) => {
    console.log("here")
    if (response.status === 201) {
      toast.success("Uploaded successfully");
    } else {
      toast.error('Error occured');
    }
  };
  const updateUser = async (values) => {
    const response = await api.put(USERS_URL, values);
    setUser(response.data.user);
    // console.log(response);
    // getUserByEmail(email);
    getCurrentUser();
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
                <AccountProfile item user={user} getCurrentUser={getCurrentUser} setUser={setUser}  handleApiResponse={handleApiResponse}/>
              </Grid>
              <Grid xs={12} md={6} lg={8}>
                <AccountProfileDetails item user={user}  updateUser={updateUser} getCurrentUser={getCurrentUser} setUser={setUser}/>
              </Grid>
            </Grid>
          </div>
        </Stack>
        <ToastContainer position='bottom-right'  />
      </Container>
    </>
  )

}
