import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit, Add, Download } from '@mui/icons-material';
import QRCode, { QRCodeCanvas } from 'qrcode.react';

//Material-UI Imports
import {
  Box,
  Button,
  MenuItem,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  FormControl,
  InputLabel,
  Select,
  ImageList,
  ImageListItem,
  CircularProgress,
} from '@mui/material';

//Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExportToCsv } from 'export-to-csv';
// import API
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import { BASE_URL, BRANDS_URL, CATEGORY_URL, PRODUCTS_URL } from './../../Constants/constants';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateNewProductModal } from '../CreateModals/createNewProducts';
import { UpdateProductModal } from '../UpdateModals/updateProductModal';

import DownloadPDFButton from './DownloadPDFButton';
import SelectedDocument from '../PrintDocument/SelectedDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';

const productImage = require('./avatar_1.jpg');

const ProductDataTable = () => {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();
  const [selectedImage, setSelectedImage] = useState(null);
  const ImageInput = useRef();

  const getProducts = async () => {
    try {
      const response = await api.get(`${PRODUCTS_URL}/store/${user.store}`);
      if (!response?.data) throw Error('no data found');
      const products = response.data;
      // console.log(products);
      setData(products);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteProduct = async (id) => {
    try {
      const response = await api.delete(`${PRODUCTS_URL}/${id}`);
      await getProducts();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };

  const deleteSpecificImage = async (id, path) => {
    try {
      const response = await api.delete(`${PRODUCTS_URL}/image/${id}/${path}`);
      await getProducts();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const updateProduct = async (value) => {
    try {
      const response = await api.put(PRODUCTS_URL, value);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createProduct = async (values) => {
    try {
      const response = await api.post(PRODUCTS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleApiResponse = (response) => {
    // console.log(response);
    if (response.status === 201 || response.status === 200) {
      toast.success('operation successfully completed');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    // console.log(values);
    values.storeId = user.store;
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    const files = values.productImages;
    formData.delete('productImages');
    formData.delete('brand.title');
    formData.delete('');
    formData.delete('category.title');
    formData.delete('_id');
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('productImages', files[i]);
      }
    }

    // console.log(formData);
    await createProduct(formData);
    getProducts();
  };

  const handleUpdateRow = async (values) => {
    // console.log(values);
    // const formData = new FormData();
    // Object.keys(values).forEach((key) => formData.append(key, values[key]));
    // console.log(formData);
    await updateProduct(values);
    getProducts();
    // alert(' success ');
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      // console.log(values);
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      const response = await api.put(PRODUCTS_URL, tableData[row.index]);
      getProducts();
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
      // window.location.reload(true);
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to delete ${row.getValue('productLabel')}`)) {
      //   return;
      // }
      setModalContent({
        title: 'Delete Product',
        content: 'Are you sure you want to delete this product?',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteProduct(row.getValue('_id'));
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });
      //send api delete request here, then refetch or update local table data for re-render
      // window.location.reload(true);
    },
    [tableData]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id', //simple recommended way to define a column
        header: 'ID',
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
      {
        accessorKey: 'productLabel', //simple recommended way to define a column
        header: 'Label',
      },

      {
        accessorKey: 'productDescription', //simple recommended way to define a column
        header: 'Description',
      },
      {
        accessorKey: 'productReference', //simple recommended way to define a column
        header: 'Reference',
      },
      {
        accessorKey: 'productQte',
        header: 'Quantite',
        size: 200,
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor:
                cell.getValue() < 100
                  ? theme.palette.error.dark
                  : cell.getValue() >= 100 && cell.getValue() < 200
                  ? theme.palette.warning.dark
                  : theme.palette.success.dark,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'productPurschasePrice',
        header: 'PurschasePrice',
        size: 200,
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: theme.palette.info.light,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },

      {
        accessorKey: 'productSellingPrice',
        header: 'SellingPrice',
        size: 200,
        //custom conditional format and styling
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: theme.palette.info.main,
              borderRadius: '0.25rem',
              color: '#fff',
              maxWidth: '9ch',
              p: '0.25rem',
            })}
          >
            {cell.getValue()}
          </Box>
        ),
      },

      {
        accessorFn: (row) => new Date(row.createdAt), //convert to Date for sorting and filtering
        id: 'createdAt',
        header: 'createdAt',
        filterFn: 'lessThanOrEqualTo',
        sortingFn: 'datetime',
        type: 'Date',
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
        Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
        //Custom Date Picker Filter from @mui/x-date-pickers
        Filter: ({ column }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={(newValue) => {
                column.setFilterValue(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={'Filter Mode: Lesss Than'}
                  sx={{ minWidth: '120px' }}
                  variant="standard"
                />
              )}
              value={column.getFilterValue()}
            />
          </LocalizationProvider>
        ),
      },
      {
        accessorKey: 'category.title',
        header: 'category',
      },
      {
        accessorKey: 'brand.title',
        header: 'Brand',
      },
    ],
    []
  );
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    // if (file && file.type === 'image/png') {
    setSelectedImage(file);
    // } else {
    //   setSelectedImage(null);
    //   alert('Please select a valid PNG file');
    // }
  };

  const DeleteImage = async (id, image, images) => {
    //
    if (images.length == 1) {
      setModalContent({
        title: "You can't delete this image",
        content: 'Product must have at least one image',
        actionText: 'Ok',
        denyText: 'Cancel',
        handleClick: () => {
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });
    } else {
      setModalContent({
        title: 'Delete Product image',
        content: 'Are you sure',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          const path = image.split('\\')[1];
          deleteSpecificImage(id, path);
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });
    }
  };
  const handleUpload = async (id) => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('id', id);
    const response = await api.post(`${PRODUCTS_URL}/image/${id}`, formData);
    if (response.data) {
      await getProducts();
      alert('added succefuly');
    }
    // console.log(formData);
    setSelectedImage(null);
  };
  const handleButtonClick = () => {
    ImageInput.current.click();
  };
  const csvExporter = new ExportToCsv(csvOptions);
  let content;
  const canvasRef = useRef(null);
  // if (isLoading) return <p>is Loading </p>;
  // else if (isSuccess)

  const [arrayOfProducts, setArrayOfProducts] = useState([]);
  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      editingMode="modal"
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      enableFullScreenToggle={false}
      onEditingRowSave={handleSaveRowEdits}
      enableRowActions
      enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <>
          <ImageList sx={{ width: 2000, height: 160 }} cols={12} rowHeight={164}>
            <Button onClick={handleButtonClick}>
              <input
                style={{ display: 'none' }}
                accept="image/png"
                id="productImage"
                onChange={handleImageSelect}
                name="productImage"
                type="file"
                ref={ImageInput}
              />
              <Add />
            </Button>
            {selectedImage && (
              <>
                {/* <Typography color="text.secondary" variant="body2">
                Selected Image: {selectedImage.name}
              </Typography> */}

                <Button fullWidth variant="text" onClick={() => handleUpload(row.original._id)}>
                  Upload
                </Button>
              </>
            )}
            {row.original.productImages.map((image) => (
              <ImageListItem key={image}>
                <img
                  width={200}
                  height={200}
                  src={image ? `${BASE_URL}${image.split('\\')[1]}` : 'null'}
                  srcSet={image ? `${BASE_URL}${image.split('\\')[1]}` : 'null'}
                  alt={image}
                  loading="lazy"
                />
                <IconButton
                  onClick={() => DeleteImage(row.original._id, image, row.original.productImages)}
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
            <div style={{ margin: 20 }}>
              <QRCodeCanvas value={row.original._id} />
              {/* <img src={QRCode.image(row.original._id, { type: 'png', size: 10 })} alt="QR code" /> */}
            </div>
          </ImageList>
        </>
      )}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton
              onClick={() => {
                setRowToUpdate(row.original);
                setUpdateModalOpen(true);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
          {row.original ? (
            <Tooltip arrow placement="right" title="Print">
              <IconButton color="success">
                <DownloadPDFButton data={row.original} />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => {
        // const handlePrintData = () => {
        //   const productsSelected = [];
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     productsSelected.push(row.original);
        //   });

        //   setArrayOfProducts(productsSelected);
        //   console.log(arrayOfProducts);
        // };
        const handleDeleteSelected = () => {
          setModalContent({
            title: 'Delete Products',
            content: 'Are you sure you want to delete selected products?',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteProduct(row.getValue('_id'));
              });
              setModalContent(null);
            },
            handleClose: () => {
              setModalContent(null);
            },
            requireComment: false,
          });
        };
        const handleExportRows = (rows) => {
          csvExporter.generateCsv(rows.map((row) => row.original));
        };
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button color="info" onClick={() => setCreateModalOpen(true)} variant="contained">
              Create New Product
            </Button>
            <Button
              color="warning"
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              //only export selected rows
              onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
              variant="contained"
            >
              Export Selected Rows
            </Button>
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleDeleteSelected}
              variant="contained"
            >
              Delete selected
            </Button>

            <UpdateProductModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewProductModal
              columns={columns}
              open={createModalOpen}
              onClose={() => setCreateModalOpen(false)}
              onSubmitModal={handleCreateNewRow}
            />
            {modalContent && <AlertDialog {...modalContent} />}
            <ToastContainer position="bottom-right" />
          </div>
        );
      }}
    />
  );
};
// export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
//   // const [addProduct] = useAddProductMutation();
//   const ImageInput = useRef();
//   const api = useAxios();
//   const user = useSelector(selectCurrentUser);
//   const [companies, setCompanies] = useState([]);
//   const [brand, setBrand] = useState([]);
//   const [selectedImages, setSelectedImages] = useState([]);

//   useEffect(() => {
//     api
//       .get(`${CATEGORY_URL}/store/${user.store}`)
//       .then((response) => {
//         setCompanies(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//     api
//       .get(`${BRANDS_URL}/store/${user.store}`)
//       .then((response) => {
//         setBrand(response.data);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, []);
//   const handleButtonClick = () => {
//     ImageInput.current.click();
//   };
//   const handleImageSelect = (event) => {
//     const files = event.target.files;
//     // for (var file of files) {
//     //   if (file && file.type !== 'image/png') {
//     //     setSelectedImages(null);
//     //     return alert('Please select a valid PNG file');
//     //   }
//     // }
//     setSelectedImages(files);
//     setValues({ ...values, [event.target.name]: files });
//   };
//   const [values, setValues] = useState(() =>
//     columns.reduce((acc, column) => {
//       acc[column.accessorKey ?? ''] = '';
//       return acc;
//     }, {})
//   );

//   const handleSubmit = async (e) => {
//     //put your validation logic here
//     // console.log(values);
//     // createProduct(values,token);
//     // try {
//     //   const response = await addProduct(values).unwrap();
//     // } catch (err) {
//     //   console.log(err);
//     // }
//     onSubmit(values);
//     onClose();
//     setValues(null);
//     setSelectedImages([]);
//     //  window.location.reload(true);
//   };

//   return (
//     <Dialog open={open}>
//       <DialogTitle textAlign="center">Create New Product</DialogTitle>

//       <DialogContent>
//         <form onSubmit={(e) => e.preventDefault()}>
//           <Stack
//             sx={{
//               width: '100%',

//               minWidth: { xs: '300px', sm: '360px', md: '400px' },

//               gap: '1.5rem',
//             }}
//           >
//             <TextField
//               label="Label"
//               name="productLabel"
//               type="text"
//               onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//             />
//             {columns
//               .filter((column) => {
//                 if (column.accessorKey == '_id') return false;
//                 if (column.accessorKey == 'category.title') return false;
//                 if (column.accessorKey == 'brand.title') return false;
//                 else if (column.id == 'createdAt') return false;
//                 else if (column.id == 'productLabel') return false;
//                 else return true;
//               })
//               .map((column) => (
//                 <TextField
//                   required
//                   key={column.accessorKey == '' ? column.accessorKey : column.id}
//                   label={column.header}
//                   name={column.accessorKey !== '' ? column.accessorKey : column.id}
//                   type={column.type}
//                   onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//                 />
//               ))}

//             <FormControl fullWidth>
//               <InputLabel id="categoryId">Category </InputLabel>
//               <Select
//                 required
//                 labelId="category"
//                 id="categoryId"
//                 name="categoryId"
//                 label="Category"
//                 onChange={(e) => {
//                   setValues({ ...values, [e.target.name]: e.target.value });
//                 }}
//               >
//                 {companies.map((option) => (
//                   <MenuItem key={option._id} value={option._id}>
//                     {option.title}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <FormControl fullWidth>
//               <InputLabel id="brandId">Brand </InputLabel>
//               <Select
//                 required
//                 labelId="brand"
//                 id="brandId"
//                 name="brandId"
//                 label="Brand"
//                 onChange={(e) => {
//                   setValues({ ...values, [e.target.name]: e.target.value });
//                 }}
//               >
//                 {brand.map((option) => (
//                   <MenuItem key={option._id} value={option._id}>
//                     {option.title}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Stack>
//           <input
//             style={{ display: 'none' }}
//             accept="image/png"
//             id="productImages"
//             onChange={handleImageSelect}
//             name="productImages"
//             type="file"
//             multiple
//             ref={ImageInput}
//           />
//           <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
//             Select Products Photos
//           </Button>

//           {selectedImages && (
//             <>
//               <Typography color="text.secondary" variant="body2">
//                 Selected Image length: {selectedImages.length}
//               </Typography>
//             </>
//           )}
//         </form>
//       </DialogContent>

//       <DialogActions sx={{ p: '1.25rem' }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
//           Create New Product
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
const validateRequired = (value) => !!value.length;

export default ProductDataTable;
