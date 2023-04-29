import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useAxios from "../../api/axios";
import { useFormik } from "formik";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import * as yup from 'yup';
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export const CreateNewBrandModal = ({ open, columns, onClose, onSubmitModal }) => {
    // const [addProduct] = useAddProductMutation();
    const ImageInput = useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const [companies, setCompanies] = useState([]);
    const user = useSelector(selectCurrentUser);
    const api = useAxios();
    const brandSchema = yup.object().shape({
      title: yup.string().required('Required'),
      description: yup.string().required('Required'),
      brandLogo: yup.mixed().required('Required'),
    });
    useEffect(() => {
      api
        .get('/api/companies')
        .then((response) => {
          setCompanies(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    const handleButtonClick = () => {
      ImageInput.current.click();
    };
  
    const handleImageSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'image/png') {
        setSelectedImage(file);
        setFieldValue('brandLogo', file);
      } else {
        setSelectedImage(null);
        alert('Please select a valid PNG file');
      }
    };
  
    // const [values, setValues] = useState(() =>
    //   columns.reduce((acc, column) => {
    //     acc[column.accessorKey ?? ''] = '';
    //     return acc;
    //   }, {})
    // );
    const onSubmit = async (values, actions) => {
      console.log(values);
      console.log(actions);
      // this function use the on Sumbit of the modal that will save new brand
  
      onSubmitModal(values);
      onClose();
      setSelectedImage(null);
      resetForm({
        values: {
          title: '',
          description: '',
        },
      });
    };
    const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
      useFormik({
        initialValues: {
          title: '',
          description: '',
          brandLogo: null,
        },
        validationSchema: brandSchema,
        onSubmit,
      });
    return (
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Brand</DialogTitle>
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
                error={errors.title && touched.title ? true : false}
                helperText={errors.title}
              />
              <TextField
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description && touched.description ? true : false}
                helperText={errors.description}
              />
           
            <input
              style={{ display: 'none' }}
              accept="image/png"
              id="BrandLogo"
              onChange={handleImageSelect}
              name="brandLogo"
              type="file"
              ref={ImageInput}
              error={errors.brandLogo && touched.brandLogo ? true : false}
              helperText={errors.brandLogo}
            />
            <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
              Select Brand Logo
            </Button>
            {errors.brandLogo ?(<Alert severity="error">{errors.brandLogo}</Alert>):null} 
  
            {selectedImage && (
              <>
              <Alert severity="success">
                <Typography color="text.secondary" variant="body2">
                  Selected Image: {selectedImage.name}
                </Typography>
                </Alert>
              </>
            )}
             </Stack>
          </DialogContent>
  
          <DialogActions sx={{ p: '1.25rem' }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button color="secondary" type="submit" variant="contained" disabled={isSubmitting}>
              Create New Brand
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };