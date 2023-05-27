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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import * as yup from 'yup';
import { Close, Delete, QrCode } from '@mui/icons-material';
import { BRANDS_URL, CATEGORY_URL } from '../../Constants';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import { useEffect } from 'react';
import Quagga from 'quagga';
export const UpdateProductModal = ({ open, row, onClose, onSubmitModal }) => {
  // scanner part
  const inputRef = useRef(null);
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

  const [companies, setCompanies] = useState([]);
  const [brand, setBrand] = useState([]);

  // yup brand schema, form should respect the followin schema
  const referenceRules = /^\d{12}$/;
  const productSchema = yup.object().shape({
    productLabel: yup.string().required('Required'),
    productDescription: yup.string().required('Required'),
    productReference: yup.string().matches(referenceRules, {
      message: 'It should match upc naming convention',
    }),
    productSellingPrice: yup
      .number()
      .moreThan(0, 'Must be greater than 0')
      .when('productPurschasePrice', (productPurschasePrice, schema) => {
        return productPurschasePrice
          ? schema.min(productPurschasePrice, 'Must be greater than or equal to purchase price')
          : schema;
      }),
    productPurschasePrice: yup.number().moreThan(0, 'Must be greater than 0'),
    productQte: yup.number().moreThan(0, 'Must be greater than 0'),
    categoryId: yup.string(),
    brandId: yup.string(),
  });

  // open directory to get specific brand logo
  const handleButtonClickCode = () => {
    inputRef.current.click();
  };

  const handleInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      Quagga.decodeSingle(
        {
          decoder: {
            readers: ['upc_reader'],
          },
          locate: true,
          src: URL.createObjectURL(file),
        },
        (result) => {
          if (result && result.codeResult) {
            setFieldValue('productReference', result.codeResult.code);

            // inputRef.current.value = result.codeResult.code;
          } else {
            console.log('No barcode found');
          }
        }
      );
    }
  };

  // when use click update brand, we will have the following actions
  const onSubmit = async (values, actions) => {
    // console.log(values);
    // console.log(actions);
    // this function use the on Sumbit of the modal that will save new brand
    onSubmitModal(values);
    onClose();
    setSelectedImages(null);
  
  };
  // formik initail values and schema
  const { values, errors, touched, isSubmitting, resetForm, setFieldValue, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        _id: row._id,
        productLabel:row.productLabel,
        productDescription: row.productDescription,
        productReference: row.productReference,
        productSellingPrice: row.productSellingPrice,
        productPurschasePrice: row.productPurschasePrice,
        productQte: row.productQte,
        categoryId: row?.category?._id,
        brandId: row.brand?._id,
      },
      validationSchema: productSchema,
      onSubmit,
    });

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

  useEffect(() => {
    setFieldValue('_id', row._id);
    setFieldValue('productLabel', row.productLabel);
    setFieldValue('productDescription', row.productDescription);
    setFieldValue('productReference', row.productReference);
    setFieldValue('productSellingPrice', row.productSellingPrice);
    setFieldValue('productPurschasePrice', row.productPurschasePrice);
    setFieldValue('productQte', row.productQte);
    setFieldValue('categoryId', row?.category?._id);
    setFieldValue('brandId', row?.brand?._id,);

  }, [row]);
  return (
    <Dialog maxWidth="lg" maxHeight={700} open={open}>
      <DialogTitle textAlign="center">Update Product</DialogTitle>
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
                  rows={3}
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
                  rows={6}
                />
                <TextField
                  label="Reference"
                  name="productReference"
                  value={values.productReference}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.productReference) && touched.productReference}
                  helperText={touched.productReference && errors.productReference}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" variant="contained" color="primary" onClick={handleButtonClickCode}>
                          <QrCode />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="camera"
                  onChange={handleInputChange}
                  ref={inputRef}
                  style={{ display: 'none' }}
                />
              </Stack>
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
        {/* <Scanner/> */}
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" type="submit" variant="contained" disabled={isSubmitting}>
          Update Product
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
