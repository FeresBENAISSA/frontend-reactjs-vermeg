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
import * as yup from 'yup';
import { useFormik } from 'formik';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const [fcmToken, setFcmToken] = useState();
  const navigate = useNavigate();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const loginSchema = yup.object().shape({
    email: yup.string().email('PLease enter a valid email').required('Required'),
    password: yup.string().min(4).required('Required'),
    // .matches(passwordRules, {
    //   message:
    //     'pleace create a strong password \n - At least 5 characters \n - 1 upper case  letter\n - 1 lower case letter \n - 1 numeric digit',
    // }),
  });
  // google notifcation
  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      //GenerateTokon
      const token = await getToken(messaging);
      setFcmToken(token);
      console.log('notif token', token);
    } else if (permission === 'denied') {
      console.log("denied")
    }
  };
  useEffect(() => {
    requestPermission();
  }, []);

  const handleClick = async (values) => {
    try {
      const email = values.email;
      const password = values.password;
      const userData = await login({ email, password, fcmToken }).unwrap();
      console.log(userData);
      const roles = userData.roles;

      console.log(email, password);
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
      console.log(error);
      if (!error.originalStatus) {
        setErrMsg('No server Response');
      } else if (error.originalStatus === 400) {
        setErrMsg('Missing Email or password');
      } else if (error.originalStatus === 401) 
      setErrMsg(error.data);
      else {
        setErrMsg('Login Failed ');
      }
      // if (!error.response) {
      //   setErrMsg('No server Response');
      // } else if (error.response?.status === 400) {
      //   setErrMsg('Missing Email or password');
      // } else if (error.response?.status === 401) setErrMsg('Unauthorized');
      // else {
      //   setErrMsg('Login Failed ');
      // }
      // errRef.current.focus();
      // console.log(error);
    }
  };

  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    await handleClick(values);
  };

  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <>
      {' '}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="email"
            label="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email && touched.email ? true : false}
            helperText={errors.email}
            // required
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            // onChange={(e) => setPassword(e.target.value)}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password && touched.password ? true : false}
            helperText={errors.password}
            // required
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
          {/* <Checkbox name="remember" label="Remember me" />
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link> */}
        </Stack>
        <LoadingButton fullWidth size="large" type="submit" variant="contained" disabled={isSubmitting}>
          Login
        </LoadingButton>
      </form>
    </>
  );
}
