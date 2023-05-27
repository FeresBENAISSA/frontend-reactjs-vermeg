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
import { useEffect } from 'react';
import { Close } from '@mui/icons-material';
import { BASE_URL } from '../../Constants';

export const UpdateBrandModal = ({ open, row, onClose, onSubmitModal }) => {
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
  // yup brand schema, form should respect the followin schema
  const brandSchema = yup.object().shape({
    title: yup.string().required('Required'),
    description: yup.string().required('Required'),
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
      setFieldValue('brandLogo', file);
      setPreviewImage(URL.createObjectURL(file)); // set preview image URL
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };
  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    // console.log(values);
    // console.log(actions);
    onSubmitModal(values);
    onClose();
    setSelectedImage(null);
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, setFieldValue, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: {
      _id: row._id,
      title: row.title,
      description: row.description,
    },
    validationSchema: brandSchema,
    onSubmit,
  });

  // when clicking on update, will change the data for specific row on launch
  useEffect(() => {
    setFieldValue('_id', row._id);
    setFieldValue('title', row.title);
    setFieldValue('description', row.description);
    const photo =row.logo ? BASE_URL + row.logo.split('\\')[1] : '';
    setSelectedImage(photo)
    setPreviewImage(photo)
  }, [row]);
  
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Update Existing Brand</DialogTitle>
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
              label="Title"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              error={Boolean(errors.title) && touched.title}
              helperText={touched.title && errors.title}
            />
            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.description) && touched.description}
              helperText={touched.description && errors.description}
              multiline
              rows={5}
            />

            <input
              style={{ display: 'none' }}
              accept="image/png"
              id="BrandLogo"
              onChange={handleImageSelect}
              name="brandLogo"
              type="file"
              ref={ImageInput}
            />
            <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
              Select Brand Logo
            </Button>

            {errors.brandLogo ? <Alert severity="error">{errors.brandLogo}</Alert> : null}

            {selectedImage && (
              <>
                <Alert severity="success" style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography color="text.secondary" variant="body2" component="span">
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
            Update Brand
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
