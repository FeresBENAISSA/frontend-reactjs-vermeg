import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
//MRT Imports
import MaterialReactTable from 'material-react-table';
import {
  Cable,
  Delete,
  Edit,
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
  DesktopWindows,
} from '@mui/icons-material';

//Material-UI Imports
import {
  Box,
  Button,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';

import { ExportToCsv } from 'export-to-csv';
// import API
import useAxios from '../../api/axios';
import { CATEGORY_URL } from '../../Constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CategoryDataTable = () => {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();

  const getCategories = async () => {
    try {
      const response = await api.get(`${CATEGORY_URL}/store/${user.store}`);
      if (!response?.data) throw Error('no data found');
      const categories = response.data;
      console.log(categories);
      setData(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await api.delete(`${CATEGORY_URL}/${id}`);
      await getCategories();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const updateCategory = async (values) => {
    try {
      const response = await api.put(CATEGORY_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createCategory = async (values) => {
    try {
      const response = await api.post(CATEGORY_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleApiResponse = (response) => {
    console.log(response)
    if (response.status === 201 ||response.status === 200) {
      toast.success('operation successfully completed');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    console.log(values);
    values.storeId = user.store;
    // const formData = new FormData();
    // Object.keys(values).forEach((key) => formData.append(key, values[key]));
    // formData.append("storeId",user.store)
    // console.log(formData);
    await createCategory(values);
    getCategories();
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
      await updateCategory(tableData[row.index]);
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
        title: 'Delete Category',
        content: 'Are you sure you want to delete this category?',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteCategory(row.getValue('_id'));
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
        accessorKey: 'title', //simple recommended way to define a column
        header: 'Title',
      },
      {
        accessorKey: 'description', //simple recommended way to define a column
        header: 'Description',
      },
      // {
      //   giaccessorKey: 'icon', //simple recommended way to define a column
      //   header: 'icon',
      // },
      // {
      //   accessorKey: 'image', //simple recommended way to define a column
      //   header: 'image',
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
            alert('deactivating ' + row.getValue('name'));
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
              Create New Category
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
              Delete
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

  const api = useAxios();

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
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Category</DialogTitle>

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
                if (column.accessorKey == 'storeLogo') return false;
                if (column.accessorKey == 'icon') return false;
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
            <FormControl fullWidth>
              <InputLabel id="icon">Icon </InputLabel>
              <Select
                labelId="icon"
                id="icon"
                name="icon"
                label="icon"
                onChange={(e) => {
                  console.log(e.target);
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              >
                <MenuItem value={'electronics'}>
                  {' '}
                  <Cable /> : Electronics
                </MenuItem>
                <MenuItem value={'cosmetics'}>
                  {' '}
                  <Brush /> : Cosmetics
                </MenuItem>
                <MenuItem value={'garments'}>
                  {' '}
                  <AccessibilityNew /> : Garments
                </MenuItem>
                <MenuItem value={'grocery'}>
                  {' '}
                  <LocalGroceryStore /> : Grocery
                </MenuItem>
                <MenuItem value={'console'}>
                  {' '}
                  <Games /> : Console
                </MenuItem>
                <MenuItem value={'car'}>
                  {' '}
                  <CarRental /> : Car
                </MenuItem>
                <MenuItem value={'computer'}>
                  {' '}
                  <LaptopMac /> : Computer
                </MenuItem>
                <MenuItem value={'smartphone'}>
                  {' '}
                  <PhoneIphone /> : Smartphone
                </MenuItem>
                <MenuItem value={'monitor'}>
                  {' '}
                  <Monitor /> : Monitor
                </MenuItem>
                <MenuItem value={'tv'}>
                  {' '}
                  <PersonalVideo /> : Tv
                </MenuItem>
                <MenuItem value={'e-bike'}>
                  {' '}
                  <BikeScooter /> : E-bike
                </MenuItem>
                {/* <MenuItem value={'desktop'}>
                  {' '}
                  <DesktopWindows /> : Desktop
                </MenuItem> */}
              </Select>
            </FormControl>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
          Create New Category
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;

export default CategoryDataTable;
