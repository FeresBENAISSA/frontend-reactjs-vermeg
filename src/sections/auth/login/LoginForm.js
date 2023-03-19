import { useLocation, useNavigate } from 'react-router-dom';
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
import axios from '../../../api/axios';

const LOGIN_URL = '/auth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();
  const errRef = useRef();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    emailRef.current.focus();
  });
  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleClick = async () => {
    const userData = await login({ email, password }).unwrap();
    console.log(userData);
    // console.log(response)c
    const roles = userData.roles;
    try {
      console.log(email, password);
      // const accessToken = response?.data.accessToken;
      // const roles = response?.data.roles;
      // console.log(response)
      // setAuth({ email, password, roles, accessToken });
      dispatch(setCredentials({ ...userData, email }));
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
