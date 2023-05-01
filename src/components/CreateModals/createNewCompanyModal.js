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
export const CreateNewCompanyModal = ({ open, columns, onClose, onSubmitModal }) => {
  const ImageInput = useRef();
  // when uploading an image, this will handle if image is selected or not
  const [selectedImage, setSelectedImage] = useState(null);
  // this state is for preview image
  const [previewImage, setPreviewImage] = useState(null);
  // this state will handle the opening and closing of modal preview
  const [openPreview, setOpenPreview] = useState(false);
  const handleClickOpen = () => {
    setOpenPreview(true);
  };
  const handleClose = () => {
    setOpenPreview(false);
  };
  const PhoneNumberRules = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  // yup brand schema, form should respect the followin schema
  const companySchema = yup.object().shape({
    companyLabel: yup.string().required('Required'),
    companyDescription: yup.string().required('Required'),
    companyAddress: yup.string().required('Required'),
    companyPhoneNumber: yup
    .string()
    .matches(PhoneNumberRules, {
      message:
        'Match france number rules :+33(9) or 0033(9) or (10)'
    })
    .required(),
    companyLogo: yup.mixed().required('Required'),
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
      setFieldValue('companyLogo', file);
      setPreviewImage(URL.createObjectURL(file)); // set preview image URL
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };
  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    // this function use the on Sumbit of the modal that will save new brand
    onSubmitModal(values);
    onClose();
    setSelectedImage(null);
    resetForm({
      values: {
        companyLabel: '',
        companyDescription: '',
        companyAddress:'',
        companyPhoneNumber:'',
      },
    });
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        companyLabel: '',
        companyDescription: '',
        companyAddress:'',
        companyPhoneNumber:'',
        companyLogo: null,
      },
      validationSchema: companySchema,
      onSubmit,
    });

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Company</DialogTitle>
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
              name="companyLabel"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.companyLabel}
              error={Boolean(errors.companyLabel) && touched.companyLabel}
              helperText={touched.companyLabel && errors.companyLabel}
            />
            <TextField
              label="Description"
              name="companyDescription"
              value={values.companyDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.companyDescription) && touched.companyDescription}
              helperText={touched.companyDescription && errors.companyDescription}
              multiline
              rows={5}
            />
            <TextField
              label="Address"
              name="companyAddress"
              value={values.companyAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.companyAddress) && touched.companyAddress}
              helperText={touched.companyAddress && errors.companyAddress}
              multiline
              rows={2}
            />
            <TextField
              label="PhoneNumber"
              name="companyPhoneNumber"
              value={values.companyPhoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.companyPhoneNumber) && touched.companyPhoneNumber}
              helperText={touched.companyPhoneNumber && errors.companyPhoneNumber}
            />
            <input
              style={{ display: 'none' }}
              accept="image/png"
              id="companyLogo"
              onChange={handleImageSelect}
              name="companyLogo"
              type="file"
              ref={ImageInput}
              error={Boolean(errors.companyLogo) && touched.companyLogo}
            />
            <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
              Select Brand Logo
            </Button>
            {errors.companyLogo && touched.companyLogo ? (
              <Alert severity="error"> {touched.companyLogo && errors.companyLogo}</Alert>
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
            Create New Company
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
