import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';

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
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

import { ExportToCsv } from 'export-to-csv';
// import API
import useAxios from '../../api/axios';
import { BASE_URL, STORES_URL } from '../../Constants';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateNewStoreModal } from '../CreateModals/createNewStoreModal';
import { UpdateStoreModal } from '../UpdateModals/updateStoreModal';
const storeImage = require('./avatar_1.jpg');

const StoreDataTable = () => {
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const api = useAxios();

  const getStores = async () => {
    try {
      const response = await api.get(STORES_URL);
      if (!response?.data) throw Error('no data found');
      const stores = response.data;
      console.log(stores);
      setData(stores);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteStore = async (id) => {
    try {
      const response = await api.delete(`${STORES_URL}/${id}`);
      await getStores();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const updateStore = async (values) => {
    try {
      const response = await api.put(STORES_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createStore = async (values) => {
    try {
      const response = await api.post(STORES_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleApiResponse = (response) => {
    console.log(response);
    if (response.status === 201 || response.status === 200) {
      toast.success('operation successfully completed');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    console.log(values);

    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    console.log(formData);
    await createStore(formData);
    getStores();
    // alert(' success ');
  };
  const handleUpdateRow = async (values) => {
    console.log(values);
    const formData = new FormData();

    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    console.log(formData);
    await updateStore(formData);
    getStores();
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const roles = [];
      console.log(values);
      tableData[row.index] = values;
      //roles from string to table
      console.log(tableData[row.index].roles);
      //send/receive api updates here, then refetch or update local table data for re-render
      await updateStore(tableData[row.index]);
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to delete ${row.getValue('storeLabel')}`)) {
      //   return;
      // }
      //send api delete request here, then refetch or update local table data for re-render
      setModalContent({
        title: 'Delete Store',
        content: 'Are you sure you want to delete this store?',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteStore(row.getValue('_id'));
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
          console.log(event);
          const isValid = cell.column.id === 'username' ? validateRequired(event.target.value) : true;
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
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
      {
        accessorKey: `storeLogo`, //accessorFn used to join multiple data into a single cell
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
              src={row.original.storeLogo ? BASE_URL + row.original.storeLogo.split('\\')[1] : storeImage}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'storeLabel', //simple recommended way to define a column
        header: 'Label',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'storeLocation', //simple recommended way to define a column
        header: 'Location',
      },
      {
        accessorKey: 'storePhoneNumber', //simple recommended way to define a column
        header: 'PhoneNumber',
      },
      {
        accessorKey: 'storeEmail', //simple recommended way to define a column
        header: 'Email',
      },

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
      enableFullScreenToggle={false}
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
      // renderDetailPanel={({ row }) => (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       justifyContent: 'space-evenly',
      //       alignItems: 'center',
      //     }}
      //   >
      //     {' '}
      //     <Typography variant="h6">Logo of {row.original.storeLabel}: </Typography>
      //     <br />
      //     <img
      //       alt="image"
      //       height={150}
      //       src={row.original.storeLogo ? BASE_URL + row.original.storeLogo.split('\\')[1] : storeImage}
      //       loading="lazy"
      //     />
      //     {/* <img alt="bank card" height={150} src={row.original.storeLogo ? BASE_URL+row.original.storeLogo.split('\\')[1] : storeImage} loading="lazy" /> */}
      //     {/* style={{ borderRadius: '50%' }} */}
      //     {/* <Box sx={{ textAlign: 'center' }}>
      //       <Typography variant="h4">Signature Catch Phrase: </Typography>
      //       <Typography variant="h1">&quot;{row.original.storeLabel}&quot;</Typography>
      //     </Box> */}
      //   </Box>
      // )}
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
        </Box>
      )}
      renderTopToolbarCustomActions={({ table }) => {
        // <Button color="secondary" onClick={() => setCreateModalOpen(true)} variant="contained"></Button>;

        const handleDeleteAll = () => {
          setModalContent({
            title: 'Delete Stores',
            content: 'Are you sure you want to delete selected Stores?',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteStore(row.getValue('_id'));
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

        const handleExportData = () => {
          csvExporter.generateCsv(data);
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button color="info" onClick={() => setCreateModalOpen(true)} variant="contained">
              Create New Store
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
              Delete Selected
            </Button>
            <UpdateStoreModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewStoreModal
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

export const CreateNewUserModal = ({ open, columns, onClose, onSubmit }) => {
  // const [addProduct] = useAddProductMutation();
  const ImageInput = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [companies, setCompanies] = useState([]);

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
      <DialogTitle textAlign="center">Create New Store</DialogTitle>

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
                if (column.accessorKey === '_id') return false;
                if (column.accessorKey === 'storeLogo') return false;
                else if (column.id === 'fullname') return false;
                else return true;
              })
              .map((column) => (
                <TextField
                  key={column.accessorKey === '' ? column.accessorKey : column.id}
                  label={column.header}
                  name={column.accessorKey !== '' ? column.accessorKey : column.id}
                  type={column.type}
                  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                />
              ))}

            <FormControl fullWidth>
              <InputLabel id="company">company </InputLabel>
              <Select
                labelId="company"
                id="companyId"
                name="companyId"
                label="Company"
                onChange={(e) => {
                  console.log(e.target);
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              >
                {companies.map((option) => (
                  <MenuItem key={option.companyLabel} value={option._id}>
                    {option.companyLabel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <input
            style={{ display: 'none' }}
            accept="image/png"
            id="storeLogo"
            onChange={handleImageSelect}
            name="storeLogo"
            type="file"
            ref={ImageInput}
          />
          <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
            Select store logo
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
          Create New Store
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;

export default StoreDataTable;
