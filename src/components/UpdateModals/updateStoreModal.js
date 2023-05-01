import { useRef, useState } from 'react';

import { useFormik } from 'formik';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import { Close } from '@mui/icons-material';
import { useEffect } from 'react';
import { BASE_URL, STORES_URL } from '../../Constants';
import useAxios from '../../api/axios';
export const UpdateStoreModal = ({ open, row, onClose, onSubmitModal }) => {
  const ImageInput = useRef();
  const api = useAxios();

  // when uploading an image, this will handle if image is selected or not
  const [selectedImage, setSelectedImage] = useState(null);
  // this state is for preview image
  const [previewImage, setPreviewImage] = useState(null);
  // this state will handle the opening and closing of modal preview
  const [openPreview, setOpenPreview] = useState(false);
  // check email state (true => email used)
  const [emailExists, setEmailExists] = useState(false);
  // check if user write new email
  const [storeMail, setStoreMail] = useState('');
  const handleClickOpen = () => {
    setOpenPreview(true);
  };
  const handleClose = () => {
    setOpenPreview(false);
  };
  const checkEmail = async (email) => {
    const obj = {
      email: email,
    };
    const response = await api.post(STORES_URL + '/check-email-store', obj);
    return response.data;
  };
  const PhoneNumberRules = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  // yup brand schema, form should respect the followin schema
  const storeSchema = yup.object().shape({
    storeLabel: yup.string().required('Required'),
    storeLocation: yup.string().required('Required'),
    storePhoneNumber: yup
      .string()
      .matches(PhoneNumberRules, {
        message: 'Match france number rules :+33(9) or 0033(9) or (10)',
      })
      .required(),
    storeEmail: yup.string().email('PLease enter a valid email').required('Required'),
    storeLogo: yup.mixed().required('Required'),
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
      setFieldValue('storeLogo', file);
      setPreviewImage(URL.createObjectURL(file)); // set preview image URL
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };
  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    console.log(values);
    if (values.storeEmail === storeMail) {
      setEmailExists(false);
      // this function use the on Sumbit of the modal that will save new brand
      onSubmitModal(values);
      onClose();
      setSelectedImage(null);
    } else {
      const response = await checkEmail(values.storeEmail);
      try {
        if (response.exists) {
          setEmailExists(true);
        } else {
          setEmailExists(false);
          // this function use the on Sumbit of the modal that will save new brand
          onSubmitModal(values);
          onClose();
          setSelectedImage(null);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        _id: row._id,
        storeLabel: row.storeLabel,
        storeLocation: row.storeLocation,
        storePhoneNumber: row.storePhoneNumber,
        storeEmail: row.storeEmail,
      },
      validationSchema: storeSchema,
      onSubmit,
    });
  useEffect(() => {
    setFieldValue('_id', row._id);
    setFieldValue('storeLabel', row.storeLabel);
    setFieldValue('storeLocation', row.storeLocation);
    setFieldValue('storePhoneNumber', row.storePhoneNumber);
    setFieldValue('storeEmail', row.storeEmail);
    const photo = row.storeLogo ? BASE_URL + row.storeLogo.split('\\')[1] : '';
    setSelectedImage(photo);
    setPreviewImage(photo);
  }, [row]);

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Update Store</DialogTitle>
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
              label="Label"
              name="storeLabel"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.storeLabel}
              error={Boolean(errors.storeLabel) && touched.storeLabel}
              helperText={touched.storeLabel && errors.storeLabel}
            />
            <TextField
              label="Location"
              name="storeLocation"
              value={values.storeLocation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.storeLocation) && touched.storeLocation}
              helperText={touched.storeLocation && errors.storeLocation}
              multiline
              rows={2}
            />
            <TextField
              label="Email"
              name="storeEmail"
              value={values.storeEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.storeEmail) && touched.storeEmail}
              helperText={touched.storeEmail && errors.storeEmail}
            />
            {emailExists && <Alert severity="error"> Email Already in use</Alert>}

            <TextField
              label="PhoneNumber"
              name="storePhoneNumber"
              value={values.storePhoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.storePhoneNumber) && touched.storePhoneNumber}
              helperText={touched.storePhoneNumber && errors.storePhoneNumber}
            />
            <input
              style={{ display: 'none' }}
              accept="image/png"
              id="storeLogo"
              onChange={handleImageSelect}
              name="storeLogo"
              type="file"
              ref={ImageInput}
              error={Boolean(errors.storeLogo) && touched.storeLogo}
            />
            <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
              Select Brand Logo
            </Button>
            {errors.storeLogo && touched.storeLogo ? (
              <Alert severity="error"> {touched.storeLogo && errors.storeLogo}</Alert>
            ) : null}

            {selectedImage && (
              <>
                <Alert severity="success" style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography inline color="text.secondary" variant="body2" component="span">
                    Selected Image: {selectedImage.name}
                  </Typography>
                  <Button color="success" inline onClick={handleClickOpen}>
                    Preview Logo
                  </Button>
                </Alert>
              </>
            )}
            <Dialog open={openPreview} onClose={handleClose}>
              <DialogTitle>Logo Preview</DialogTitle>
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
          <Button color="secondary" type="submit" variant="contained" disabled={isSubmitting}>
            Update Store
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
