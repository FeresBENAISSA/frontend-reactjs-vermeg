import { Card, CardContent, CardHeader, Grid, TextField, Box, Divider, CardActions, Button } from '@mui/material';
import { useFormik } from 'formik';
// import { useCallback, useEffect, useState } from 'react';
import useAxios from '../../../api/axios';
import { USERS_URL } from '../../../Constants';
import * as yup from 'yup';
export const AccountProfileDetails = ({ getCurrentUser, user, handleApiResponse }) => {
  const api = useAxios();
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const PhoneNumberRules = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  // france phoneNumber
  const userSchema = yup.object().shape({
    firstname: yup.string().required('Required'),
    lastname: yup.string().required('Required'),
    username: yup.string().required('Required'),
    email: yup.string().email('PLease enter a valid email').required('Required'),
    // phoneNumber: yup.number().positive().integer().min(5).required('Required'),
    phoneNumber: yup
      .string()
      .matches(PhoneNumberRules, {
        message: 'Match france number rules :+33(9) or 0033(9) or (10)',
      }),
    password: yup
      .string()
      .min(5)
      .matches(passwordRules, {
        message:
          'pleace create a strong password \n - At least 5 characters \n - 1 upper case  letter\n - 1 lower case letter \n - 1 numeric digit',
      })

  });
  const updateUser = async (values) => {
    values._id = user._id;
    const response = await api.put(USERS_URL, values);
    // console.log(response)
    if (response.status === 201) {
      handleApiResponse(response);
    }
    await getCurrentUser();
    // console.log(response);
  };
  const onSubmit = async (values, actions) => {
    // console.log(values);
    // console.log(actions);
    await updateUser(values);
   
    // alert('user updated ');
    // actions.resetForm();
  };
  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      password: '',
      phoneNumber: user.phoneNumber,
    },
    validationSchema: userSchema,
    onSubmit,
  });

  if (user)
    return (
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Card sx={{ ml: 3 }}>
          <CardHeader subheader="The information can be edited" title="Profile" sx={{ mb: 5 }} />
          <CardContent sx={{ pt: 0, ml: 4 }}>
            <Box sx={{ m: -1.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    label="First name"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.firstname && touched.firstname ? true : false}
                    helperText={errors.firstname}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    label="Last name"
                    name="lastname"
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.lastname && touched.lastname ? true : false}
                    helperText={errors.lastname}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email && touched.email ? true : false}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item  xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={errors.username && touched.username ? true : false}
                    helperText={errors.username}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password && touched.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    error={Boolean(errors.phoneNumber) && touched.phoneNumber}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" disabled={isSubmitting} type="submit">
              {/* onClick={handleSubmit} */}
              Save details
            </Button>
          </CardActions>
        </Card>
      </form>
    );
  else return <></>;

  // if (user)
  //   return (
  //     <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
  //       <Card sx={{ ml: 3 }}>
  //         <CardHeader subheader="The information can be edited" title="Profile" sx={{ mb: 5 }} />
  //         <CardContent sx={{ pt: 0, ml: 4 }}>
  //           <Box sx={{ m: -1.5 }}>
  //             <Grid container spacing={3}>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   helperText="Please specify the first name"
  //                   label="First name"
  //                   name="firstname"
  //                   onChange={handleChange}
  //                   required
  //                   value={user.firstname}
  //                 />
  //               </Grid>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Last name"
  //                   name="lastname"
  //                   onChange={handleChange}
  //                   required
  //                   value={user.lastname}
  //                 />
  //               </Grid>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   disabled
  //                   label="Email Address"
  //                   name="email"
  //                   onChange={handleChange}
  //                   required
  //                   value={user.email}
  //                 />
  //               </Grid>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Username"
  //                   name="username"
  //                   onChange={handleChange}
  //                   type="text"
  //                   value={user.username}
  //                   required
  //                 />
  //               </Grid>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Password"
  //                   name="password"
  //                   onChange={handleChange}
  //                   required
  //                   value={user.password}
  //                 />
  //               </Grid>
  //               <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
  //                 <TextField
  //                   fullWidth
  //                   label="Phone Number"
  //                   name="phoneNumber"
  //                   onChange={handleChange}
  //                   type="number"
  //                   value={user.phoneNumber}
  //                   required
  //                 />
  //               </Grid>
  //             </Grid>
  //           </Box>
  //         </CardContent>
  //         <Divider />
  //         <CardActions sx={{ justifyContent: 'flex-end' }}>
  //           <Button variant="contained" onClick={handleSubmit}>
  //             Save details
  //           </Button>
  //         </CardActions>
  //       </Card>
  //     </form>
  //   );
  // else return <></>;
};
