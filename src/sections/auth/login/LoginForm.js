import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import { useState, useEffect, useRef } from 'react';
//api and
// import useAuth from '../../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../../redux/features/auth/authApiSlice';
import { setCredentials } from '../../../redux/features/auth/authSlice';
import { CometChat } from '@cometchat-pro/chat';
import { AUTH_KEY } from '../../../Constants';
import { messaging } from '../../../firebase';
import { getToken } from 'firebase/messaging';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [fcmToken,setFcmToken]= useState();
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      //GenerateTokon
      const token= await getToken(messaging);
      setFcmToken(token)
      console.log('notif token', token);
    } else if (permission === 'denied') {
    }
  };
  useEffect(() => {
    requestPermission();
  }, []);

  const navigate = useNavigate();
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef.current.focus();
  });
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleClick = async () => {
    console.log(fcmToken)
    const userData = await login({ email, password ,fcmToken}).unwrap();
    // console.log(response)c
    const roles = userData.roles;
    try {
      console.log(email, password);
      // const accessToken = response?.data.accessToken;
      // const roles = response?.data.roles;
      // console.log(response)
      // setAuth({ email, password, roles, accessToken });
      dispatch(setCredentials({ ...userData, email }));
      const UID = userData.user._id;
      console.log(userData);

      CometChat.getLoggedinUser().then(
        (user) => {
          if (!user) {
            CometChat.login(UID, AUTH_KEY).then(
              (user) => {
                console.log('Login Successful:', { user });
              },
              (error) => {
                console.log('Login failed with exception:', { error });
              }
            );
          }
        },
        (error) => {
          console.log('Some Error Occured', { error });
        }
      );

      setEmail('');
      setPassword('');

      if (roles.includes('BANK_AGENT')) {
        console.log('bank');
        navigate('/dashboard/bank', { replace: true });
      } else if (roles.includes('ADMIN')) {
        navigate('/dashboard/admin', { replace: true });
      } else if (roles.includes('STORE_MANAGER')) {
        navigate('/dashboard/manager', { replace: true });
      } else {
        console.log('non');
      }

      console.log('here');
    } catch (error) {
      if (!error.response) {
        setErrMsg('No server Response');
      } else if (error.response?.status === 400) {
        setErrMsg('Missing Email or password ');
      } else if (error.response?.status === 401) setErrMsg('Unauthorized');
      else {
        setErrMsg('Login Failed ');
      }
      // errRef.current.focus();
      // console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errMsg && (
          <Alert ref={errRef} variant={'outlined'} severity="error" hidden={errMsg}>
            {errMsg}
          </Alert>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
