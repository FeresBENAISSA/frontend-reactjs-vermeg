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
  FormHelperText,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import { Close, Delete } from '@mui/icons-material';
import { BRANDS_URL, CATEGORY_URL } from '../../Constants';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import { useEffect } from 'react';
export const CreateNewProductModal = ({ open, columns, onClose, onSubmitModal }) => {
  const api = useAxios();
  const user = useSelector(selectCurrentUser);
  const ImageInput = useRef();
  // when uploading an image, this will handle if image is selected or not
  const [selectedImages, setSelectedImages] = useState([]);
  // this state is for preview image
  const [previewImage, setPreviewImage] = useState(null);
  // this state will handle the opening and closing of modal preview
  const [openPreview, setOpenPreview] = useState(false);
  const handleClickOpen = (index) => {
    setPreviewImage(URL.createObjectURL(Array.from(selectedImages)[index]));
    setOpenPreview(true);
  };
  const handleClose = () => {
    setPreviewImage(null);
    setOpenPreview(false);
  };
  // yup brand schema, form should respect the followin schema
  const productSchema = yup.object().shape({
    productLabel: yup.string().required('Required'),
    productDescription: yup.string().required('Required'),
    productReference: yup.string().required('Required'),
    productSellingPrice: yup.number().moreThan(0, 'Must be greater than 0')
                            .when('productPurschasePrice', (productPurschasePrice, schema) => {
                                return productPurschasePrice
                                  ? schema.min(productPurschasePrice, 'Must be greater than or equal to purchase price')
                                  : schema;
                              }).required('Required'),
    productPurschasePrice: yup.number().moreThan(0, 'Must be greater than 0').required('Required'),
    productQte: yup.number().required('Required'),
    categoryId: yup.string().required('Required'),
    brandId: yup.string().required('Required'),
    productImages: yup.mixed(),
  });
  
  
  
  
  // open directory to get specific brand logo
  const handleButtonClick = () => {
    ImageInput.current.click();
  };
  // by selecting new image, we gonna handle changes for preview and selected image to upload
  const handleImageSelect = (event) => {
    const files = event.target.files;
    // for (var file of files) {
    //   if (file && file.type !== 'image/png') {
    //     setSelectedImages(null);
    //     return alert('Please select a valid PNG file');
    //   }
    // }
    setSelectedImages(files);
    setFieldValue('productImages', files);
    // setPreviewImage(URL.createObjectURL(file));

    // const file = event.target.files[0];
    // if (file && file.type === 'image/png') {
    //   setSelectedImage(file);
    //   setFieldValue('productImages', file);
    //   setPreviewImage(URL.createObjectURL(file)); // set preview image URL
    // } else {
    //   setSelectedImage(null);
    //   alert('Please select a valid PNG file');
    // }
  };
  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    console.log(values);
    console.log(actions);
    // this function use the on Sumbit of the modal that will save new brand
    onSubmitModal(values);
    onClose();
    setSelectedImages(null);
    resetForm({
      values: {
        productLabel: '',
        productDescription: '',
        productReference: '',
        productSellingPrice: '',
        productPurschasePrice: '',
        productQte: '',
        categoryId: '',
        brandId: '',
      },
    });
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        productLabel: '',
        productDescription: '',
        productReference: '',
        productSellingPrice: '',
        productPurschasePrice: '',
        productQte: '',
        categoryId: '',
        brandId: '',
        productImages: null,
      },
      validationSchema: productSchema,
      onSubmit,
    });
  const [companies, setCompanies] = useState([]);
  const [brand, setBrand] = useState([]);
  useEffect(() => {
    api
      .get(`${CATEGORY_URL}/store/${user.store}`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    api
      .get(`${BRANDS_URL}/store/${user.store}`)
      .then((response) => {
        setBrand(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleDeleteImage = (index) => {
    setSelectedImages(prevImages => {
      const newImages = Array.from(prevImages)
      newImages.splice(index, 1)
      return newImages
    })
  };
  return (
    <Dialog maxWidth="lg" maxHeight={700} open={open}>
      <DialogTitle textAlign="center">Create New Product</DialogTitle>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <DialogContent>
          {/* style={{ width: '800px', height: '450px' }} */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Stack
                sx={{
                  width: '100%',
                  //   minWidth: { xs: '300px', sm: '360px', md: '400px' },
                  gap: '1.5rem',
                }}
              >
                <TextField
                  label="Label "
                  name="productLabel"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.productLabel}
                  error={Boolean(errors.productLabel) && touched.productLabel}
                  helperText={touched.productLabel && errors.productLabel}
                  multiline
                  rows={2}
                />
                <TextField
                  label="Description"
                  name="productDescription"
                  value={values.productDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productDescription) && touched.productDescription}
                  helperText={touched.productDescription && errors.productDescription}
                  multiline
                  rows={3}
                />
                <TextField
                  label="Reference"
                  name="productReference"
                  value={values.productReference}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productReference) && touched.productReference}
                  helperText={touched.productReference && errors.productReference}
                />
              </Stack>
              <input
                style={{ display: 'none' }}
                accept="image/png"
                id="productImages"
                onChange={handleImageSelect}
                name="productImages"
                type="file"
                multiple
                ref={ImageInput}
              />
              <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
                Select Product Images
              </Button>
              {errors.productImages && touched.productImages ? (
                <Alert severity="error"> {touched.productImages && errors.productImages}</Alert>
              ) : null}
             { selectedImages?(
              <ImageList
                sx={{
                  width: '100%',
                  height: 'auto',
                  mt: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  '& > *': {
                    width: 'calc(33.3% - 8px)',
                    marginBottom: '16px',
                  },
                  '@media (max-width: 600px)': {
                    '& > *': {
                      width: 'calc(50% - 8px)',
                    },
                  },
                  '@media (max-width: 400px)': {
                    '& > *': {
                      width: '100%',
                    },
                  },
                }}
                cols={4}
                rowHeight={164}
              >
                {Array.from(selectedImages).map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      width={200}
                      height={200}
                      style={{ height: 150 }}
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index}`}
                      onClick={() => handleClickOpen(index)}
                    />
                    <IconButton
                      onClick={() => handleDeleteImage(index)}
                      sx={{
                        color: 'red',
                        backgroundColor: 'white',
                        position: 'absolute',
                        buttom: '50%',
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>):null}
              {/* {selectedImages && (
                <>
                  <Alert severity="success" style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography inline color="text.secondary" variant="body2" component="span">
                      Selected Image: {selectedImages.name}
                    </Typography>
                    <Button color="success" inline onClick={handleClickOpen}>
                      Preview Logo
                    </Button>
                  </Alert>
                </>
              )} */}
              <Dialog open={openPreview} onClose={handleClose}>
                <DialogTitle>Logo Preview</DialogTitle>
                <DialogContent>
                  <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="preview" />
                  <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleClose}>
                    <Close />
                  </IconButton>
                </DialogContent>
              </Dialog>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack
                sx={{
                  width: '100%',
                  //   minWidth: { xs: '300px', sm: '360px', md: '400px' },
                  gap: '1.6rem',
                }}
              >
                <FormControl fullWidth error={Boolean(errors.categoryId) && touched.categoryId}>
                  <InputLabel id="categoryId">Category </InputLabel>
                  <Select
                    labelId="category"
                    id="categoryId"
                    name="categoryId"
                    label="Category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {companies.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.categoryId && errors.categoryId}</FormHelperText>
                </FormControl>
                <FormControl fullWidth error={Boolean(errors.brandId) && touched.brandId}>
                  <InputLabel id="brandId">Brand </InputLabel>
                  <Select
                    labelId="brand"
                    id="brandId"
                    name="brandId"
                    label="Brand"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.brandId && errors.brandId}
                  >
                    {brand.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.brandId && errors.brandId}</FormHelperText>
                </FormControl>
                <TextField
                  label="Selling Price "
                  name="productSellingPrice"
                  type="Number"
                  value={values.productSellingPrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productSellingPrice) && touched.productSellingPrice}
                  helperText={touched.productSellingPrice && errors.productSellingPrice}
                />
                <TextField
                  label="Pruschase Price"
                  name="productPurschasePrice"
                  type="Number"
                  value={values.productPurschasePrice}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productPurschasePrice) && touched.productPurschasePrice}
                  helperText={touched.productPurschasePrice && errors.productPurschasePrice}
                />
                <TextField
                  label="Quantity"
                  name="productQte"
                  value={values.productQte}
                  type="Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productQte) && touched.productQte}
                  helperText={touched.productQte && errors.productQte}
                />
              </Stack>
            </Grid>
          </Grid>
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
