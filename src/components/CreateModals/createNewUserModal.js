import { useRef, useState } from 'react';

import { useFormik } from 'formik';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import { Close } from '@mui/icons-material';
import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { ADMIN, AVAILABLE_STORES_URL, BANK_AGENT, STORE_MANAGER, USERS_URL } from '../../Constants';
export const CreateNewUserModal = ({ open, columns, onClose, onSubmitModal }) => {
  const api = useAxios();
  // check email state (true => email used)
  const [emailExists, setEmailExists] = useState(false);

  const ImageInput = useRef();
  // when uploading an image, this will handle if image is selected or not
  const [selectedImage, setSelectedImage] = useState(null);
  // this state is for preview image
  const [previewImage, setPreviewImage] = useState(null);
  // this state will handle the opening and closing of modal preview
  const [openPreview, setOpenPreview] = useState(false);
  // selected roles base on role if role = store manager we will show new select to select store
  const [selectedOption, setSelectedOption] = useState(null);
  // if we select store manager, we will choose store
  const [subOptions, setSubOptions] = useState([]);
  // regex to match for password
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const PhoneNumberRules = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  // france phoneNumber
  const handleClickOpen = () => {
    setOpenPreview(true);
  };
  const handleClose = () => {
    setOpenPreview(false);
  };
  // check if email already in use or not
  const checkEmail = async (email) => {
    const obj = {
      email: email,
    };
    const response = await api.post(USERS_URL + '/check-email', obj);
    return response.data;
  };

  // yup user schema, form should respect the following schema
  const userSchema = yup.object().shape({
    // .required('Required'),
    firstname: yup.string().required('Required'),
    lastname: yup.string().required('Required'),
    username: yup.string().required('Required'),
    email: yup.string().email('PLease enter a valid email').required('Required'),
    // phoneNumber: yup.number().positive().integer().min(5).required('Required'),
    phoneNumber: yup
      .string()
      .matches(PhoneNumberRules, {
        message: 'Match france number rules :+33(9) or 0033(9) or (10)',
      })
      .required(),
    password: yup
      .string()
      .min(5)
      .matches(passwordRules, {
        message:
          'pleace create a strong password \n - At least 5 characters \n - 1 upper case  letter\n - 1 lower case letter \n - 1 numeric digit',
      })
      .required(),
    avatar: yup.mixed().required('Required'),
    roles: yup.string().required('Required'),
    // storeId: yup.string().when('roles', {
    //   is: (value) => value === 'STORE_MANAGER',
    //   then: yup.string().required('Field 2 is required when Field 1 is specificValue'),
    //   otherwise: yup.string().required("test").nullable(),
    // }),
  });
  // open directory to get specific brand logo
  const handleButtonClick = () => {
    ImageInput.current.click();
  };
  // by selecting new image, we gonna handle changes for preview and selected image to upload
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/png') {
      setSelectedImage(file);
      setFieldValue('avatar', file);
      setPreviewImage(URL.createObjectURL(file)); // set preview image URL
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };
  // affect subSelectedOption ==> store when role= store manage

  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    try {
      console.log(values);
      const response = await checkEmail(values.email);

      if (response.exists) {
        setEmailExists(true);
      } else {
        setEmailExists(false);
        // this function use the on Sumbit of the modal that will save new brand
        onSubmitModal(values);
        onClose();
        setSelectedImage(null);
        resetForm({
          values: {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            roles: '',
            phoneNumber: '',
            storeId: '',
            password: '',
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        roles: '',
        phoneNumber: '',
        storeId: '',
        password: '',
        avatar: null,
      },
      validationSchema: userSchema,
      onSubmit,
    });
  useEffect(() => {
    if (values.roles === 'STORE_MANAGER') {
      api
        .get(AVAILABLE_STORES_URL)
        .then((response) => {
          console.log(response);
          setSubOptions(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [values.roles]);
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New User</DialogTitle>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <TextField
              label="Firstname"
              name="firstname"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstname}
              error={Boolean(errors.firstname) && touched.firstname}
              helperText={touched.firstname && errors.firstname}
            />
            <TextField
              label="Lastname"
              name="lastname"
              value={values.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.lastname) && touched.lastname}
              helperText={touched.lastname && errors.lastname}
            />
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.email) && touched.email}
              helperText={touched.email && errors.email}
            />
            {emailExists && <Alert severity="error"> Email Already in use</Alert>}
            <TextField
              label="Username"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.username) && touched.username}
              helperText={touched.username && errors.username}
            />
            <TextField
              label="PhoneNumber"
              name="phoneNumber"
              type="text"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.phoneNumber) && touched.phoneNumber}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />
            <FormControl fullWidth error={Boolean(errors.lastname) && touched.lastname}>
              <InputLabel id="roles">Roles</InputLabel>
              <Select
                labelId="roles"
                id="roles"
                name="roles"
                label="Roles"
                value={values.roles}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value={STORE_MANAGER}>Store Manager</MenuItem>
                <MenuItem value={BANK_AGENT}>Bank agent</MenuItem>
                <MenuItem value={ADMIN}>Admin </MenuItem>
              </Select>
            </FormControl>
            {values.roles === 'STORE_MANAGER' ? (
              <FormControl fullWidth>
                <InputLabel id="store">Store </InputLabel>
                <Select
                  labelId="store"
                  id="store"
                  name="storeId"
                  label="store"
                  value={values.storeId}
                  required={values.roles === 'STORE_MANAGER'}
                  onChange={handleChange}
                  //   onBlur={handleBlur}
                >
                  {subOptions.map((option) => (
                    <MenuItem key={option.storeLabel} value={option._id}>
                      {option.storeLabel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <TextField
              label="password"
              name="password"
              type="text"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.password) && touched.password}
              helperText={touched.password && errors.password}
            />
            <input
              style={{ display: 'none' }}
              accept="image/png"
              id="avatar"
              onChange={handleImageSelect}
              name="avatar"
              type="file"
              ref={ImageInput}
              error={Boolean(errors.avatar) && touched.avatar}
            />
            <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
              Select Avatar
            </Button>
            {errors.avatar && touched.avatar ? (
              <Alert severity="error"> {touched.avatar && errors.avatar}</Alert>
            ) : null}

            {selectedImage && (
              <>
                <Alert severity="success" style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography inline color="text.secondary" variant="body2" component="span">
                    Selected Image: {selectedImage.name}
                  </Typography>
                  <Button color="success" inline onClick={handleClickOpen}>
                    Preview Avatar
                  </Button>
                </Alert>
              </>
            )}
            <Dialog open={openPreview} onClose={handleClose}>
              <DialogTitle>Avatar Preview</DialogTitle>
              <DialogContent>
                <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="preview" />
                <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleClose}>
                  <Close />
                </IconButton>
              </DialogContent>
            </Dialog>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained">
            Create New User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
