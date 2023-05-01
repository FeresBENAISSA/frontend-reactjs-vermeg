import { useFormik } from "formik";
import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  FormHelperText,
} from '@mui/material';
import {
  Cable,
  PhoneIphone,
  LaptopMac,
  CarRental,
  Games,
  LocalGroceryStore,
  AccessibilityNew,
  Brush,
  Monitor,
  BikeScooter,
  PersonalVideo,
} from '@mui/icons-material';
import * as yup from 'yup';
import { Close } from '@mui/icons-material';
export const CreateNewCategoryModal = ({ open, columns, onClose, onSubmitModal }) => {
  // yup brand schema, form should respect the followin schema
  const categorySchema = yup.object().shape({
    title: yup.string().required('Required'),
    description: yup.string().required('Required'),
    icon: yup.string().required('Required'),
  });
  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    // this function use the on Sumbit of the modal that will save new brand
    onSubmitModal(values);
    onClose();
    resetForm({
      values: {
        title: '',
        description: '',
        icon: '',
      },
    });
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        title: '',
        description: '',
        icon: '',
      },
      validationSchema: categorySchema,
      onSubmit,
    });

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Category</DialogTitle>
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

            <FormControl fullWidth error={Boolean(errors.icon) && touched.icon}>
              <InputLabel id="icon">Icon </InputLabel>
              <Select
                labelId="icon"
                id="icon"
                name="icon"
                label="icon"
                onChange={handleChange}
                onBlur={handleBlur}

              >
                <MenuItem value={'electronics'}>
                  <Cable /> : Electronics
                </MenuItem>
                <MenuItem value={'cosmetics'}>
                  <Brush /> : Cosmetics
                </MenuItem>
                <MenuItem value={'garments'}>
                  <AccessibilityNew /> : Garments
                </MenuItem>
                <MenuItem value={'grocery'}>
                  <LocalGroceryStore /> : Grocery
                </MenuItem>
                <MenuItem value={'console'}>
                  <Games /> : Console
                </MenuItem>
                <MenuItem value={'car'}>
                  <CarRental /> : Car
                </MenuItem>
                <MenuItem value={'computer'}>
                  <LaptopMac /> : Computer
                </MenuItem>
                <MenuItem value={'smartphone'}>
                  <PhoneIphone /> : Smartphone
                </MenuItem>
                <MenuItem value={'monitor'}>
                  <Monitor /> : Monitor
                </MenuItem>
                <MenuItem value={'tv'}>
                  <PersonalVideo /> : Tv
                </MenuItem>
                <MenuItem value={'e-bike'}>
                  <BikeScooter /> : E-bike
                </MenuItem>
              </Select>
              <FormHelperText>{touched.icon && errors.icon}</FormHelperText>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
            Create New Category
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
