import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';

//Material-UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

import { ExportToCsv } from 'export-to-csv';
// import API
import useAxios from '../../api/axios';
import { BASE_URL, BRANDS_URL, CATEGORY_URL, STORES_URL } from '../../Constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from './AlertDialog';

const BrandDataTable = () => {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();
  // api's
  const getBrands = async () => {
    try {
      const response = await api.get(`${BRANDS_URL}/store/${user.store}`);
      if (!response?.data) throw Error('no data found');
      const brands = response.data;
      console.log(brands);
      setData(brands);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBrand = async (id) => {
    try {
      const response = await api.delete(`${BRANDS_URL}/${id}`);
      await getBrands();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
    // alert('deleted succefuly');
  };
  const updateBrand = async (values) => {
    try {
      const response = await api.put(BRANDS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createBrand = async (values) => {
    try {
      const response = await api.post(BRANDS_URL, values);
      console.log(response)
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // toast notification functions
  const handleApiResponse = (response) => {
    if (response.status === 201) {
      console.log(response.data);
      toast.success('deleted succefuly');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    console.log(values);
    values.storeId = user.store;
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append('storeId', user.store);
    console.log(formData);
    await createBrand(formData);
    getBrands();
    // alert(' success ');
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const roles = [];
      console.log(values);
      tableData[row.index] = values;
      //roles from string to table
      // console.log(tableData[row.index].roles);
      //send/receive api updates here, then refetch or update local table data for re-render
      await updateBrand(tableData[row.index]);
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to delete ${row.getValue('title')}`)) {
      //   return;
      // }
      //send api delete request here, then refetch or update local table data for re-render

      setModalContent({
        title: 'Delete Brand',
        content: 'Are you sure you want to delete this brand?',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteBrand(row.getValue('_id'));
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          // console.log(validateRequired(event.target.value))
          const isValid = cell.column.id === 'title' ? validateRequired(event.target.value) : true;
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id', //simple recommended way to define a column
        header: 'ID',
        enableEditing: false,
        // muiTableBodyCellEditTextFieldProps: {
        //   disabled: true,
        // },
      },
      {
        accessorKey: `logo`, //accessorFn used to join multiple data into a single cell
        //id is still required when using accessorFn instead of accessorKey
        header: 'Logo',
        size: 10,
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',

              gap: '1rem',
            }}
          >
            <img
              alt="avatar"
              height={50}
              width={50}
              src={row.original.logo ? BASE_URL + row.original.logo.split('\\')[1] : null}
              loading="lazy"
              // style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'title', //simple recommended way to define a column
        header: 'Title',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'description', //simple recommended way to define a column
        header: 'Description',
      },
      // {
      //   accessorKey: 'image', //simple recommended way to define a column
      //   header: 'image',
      // },
      // {
      //   accessorKey: 'roles', //simple recommended way to define a column
      //   header: 'Roles',
      //   muiTableBodyCellEditTextFieldProps: {
      //     disabled: true,
      //   },
      // },
    ],
    [getCommonEditTextFieldProps]
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

  const csvExporter = new ExportToCsv(csvOptions);
  let content;
  // if (isLoading) return <p>is Loading </p>;
  // else if (isSuccess)
  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      editingMode="modal"
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
      onEditingRowSave={handleSaveRowEdits}
      enableRowActions
      enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
      renderDetailPanel={({ row }) => (
        <></>
        // <Box
        //   sx={{
        //     display: 'flex',
        //     justifyContent: 'space-evenly',
        //     alignItems: 'center',
        //   }}
        // >
        //   {' '}
        //   <Typography variant="h6">Logo of {row.original.storeLabel}: </Typography>
        //   <br />
        //   <img
        //     alt="image"
        //     height={150}
        //     src={row.original.storeLogo ? BASE_URL + row.original.storeLogo.split('\\')[1] : storeImage}
        //     loading="lazy"
        //   />
        //   {/* <img alt="bank card" height={150} src={row.original.storeLogo ? BASE_URL+row.original.storeLogo.split('\\')[1] : storeImage} loading="lazy" /> */}
        //   {/* style={{ borderRadius: '50%' }} */}
        //   {/* <Box sx={{ textAlign: 'center' }}>
        //     <Typography variant="h4">Signature Catch Phrase: </Typography>
        //     <Typography variant="h1">&quot;{row.original.storeLabel}&quot;</Typography>
        //   </Box> */}
        // </Box>
      )}
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => {
        // <Button color="secondary" onClick={() => setCreateModalOpen(true)} variant="contained"></Button>;

        const handleDeleteAll = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('delete ' + row.getValue('name'));
          });
        };
        const handleExportRows = (rows) => {
          csvExporter.generateCsv(rows.map((row) => row.original));
        };

        const handleExportData = () => {
          csvExporter.generateCsv(data);
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button color="info" onClick={() => setCreateModalOpen(true)} variant="contained">
              Create New Brand
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
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onClick={handleDeleteAll}
              variant="contained"
            >
              Delete selected
            </Button>
            <CreateNewUserModal
              columns={columns}
              open={createModalOpen}
              onClose={() => setCreateModalOpen(false)}
              onSubmit={handleCreateNewRow}
            />
            {modalContent && <AlertDialog {...modalContent} />}
            <ToastContainer position="bottom-right" />
          </div>
        );
      }}
    />
  );
};

export const CreateNewUserModal = ({ open, columns, onClose, onSubmit }) => {
  // const [addProduct] = useAddProductMutation();
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const user = useSelector(selectCurrentUser);
  const api = useAxios();

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
      setValues({ ...values, [event.target.name]: file });
    } else {
      setSelectedImage(null);
      alert('Please select a valid PNG file');
    }
  };

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  const handleSubmit = async (e) => {
    //put your validation logic here
    console.log(values);
    // createProduct(values,token);
    try {
      // const response = await addProduct(values).unwrap();
    } catch (err) {
      console.log(err);
    }
    onSubmit(values);
    onClose();
    setSelectedImage(null);
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Brand</DialogTitle>

      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',

              minWidth: { xs: '300px', sm: '360px', md: '400px' },

              gap: '1.5rem',
            }}
          >
            {columns
              .filter((column) => {
                if (column.accessorKey == '_id') return false;
                if (column.accessorKey == 'logo') return false;
                else if (column.id == 'fullname') return false;
                else return true;
              })
              .map((column) => (
                <TextField
                  key={column.accessorKey == '' ? column.accessorKey : column.id}
                  label={column.header}
                  name={column.accessorKey !== '' ? column.accessorKey : column.id}
                  type={column.type}
                  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                />
              ))}
          </Stack>
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
          {selectedImage && (
            <>
              <Typography color="text.secondary" variant="body2">
                Selected Image: {selectedImage.name}
              </Typography>

              {/* <Button fullWidth variant="text" onClick={handleUpload}>
                Upload
              </Button> */}
            </>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
          Create New Brand
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;

export default BrandDataTable;
