import React, { useMemo, useState, useCallback, useEffect } from 'react';

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
import { selectCurrentToken } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import { BASE_URL, USERS_URL } from '../../Constants';
const userImage = require('./avatar_1.jpg');

const UserDataTable = () => {
  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();

  const getUsers = async () => {
    try {
      const response = await api.get(USERS_URL);
      if (!response?.data) throw Error('no data found');
      const users = response.data;
      console.log(users);
      setData(users);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (id) => {
    await api.delete(`${USERS_URL}/${id}`);
  };
  const updateUser = async (values) => {
    await api.put(USERS_URL, values);
  };
  const createUser = async (values) => {
    const response = await api.post(USERS_URL, values);
    if (response?.data) {
      //   tableData.push(values);
      //   setTableData([...tableData]);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleCreateNewRow = async (values) => {
    console.log(values)
    createUser(values);
    // api.post(USERS_URL, values).then(() => {
    //   tableData.push(values);
    //   setTableData([...tableData]);
    // });
    // createProduct(values, token);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const roles = [];
      console.log(values);
      tableData[row.index] = values;
      //roles from string to table
      console.log(tableData[row.index].roles);
      //send/receive api updates here, then refetch or update local table data for re-render
      await updateUser(tableData[row.index]);
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!window.confirm(`Are you sure you want to delete ${row.getValue('username')}`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      deleteUser(row.getValue('_id'));
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
        accessorFn: (row) => `${row.firstname} ${row.lastname}`, //accessorFn used to join multiple data into a single cell
        id: 'name', //id is still required when using accessorFn instead of accessorKey
        header: 'Full Name',
        size: 250,
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
              height={40}
              width={40}
              src={row.original.avatar ? BASE_URL + row.original.avatar.split('\\')[1] : userImage}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: 'username', //simple recommended way to define a column
        header: 'Username',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email', //simple recommended way to define a column
        header: 'Email',
      },
      {
        accessorKey: 'roles', //simple recommended way to define a column
        header: 'Roles',
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <img alt="image" height={150} src={row.original?.productImage} loading="lazy" />
          <img alt="bank card" height={150} src={row.original?.credit} loading="lazy" />
          {/* style={{ borderRadius: '50%' }} */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">Signature Catch Phrase: </Typography>
            <Typography variant="h1">&quot;{row.original.signatureCatchPhrase}&quot;</Typography>
          </Box>
        </Box>
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
              Create New User
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
          </div>
        );
      }}
    />
  );
};

export const CreateNewUserModal = ({ open, columns, onClose, onSubmit }) => {
  // const [addProduct] = useAddProductMutation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [subOptions, setSubOptions] = useState([]);

  const api = useAxios();
  useEffect(() => {
    if (selectedOption === 'STORE_MANAGER') {
      api
        .get('/api/options')
        .then((response) => {
          setSubOptions(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedOption]);

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
      <DialogTitle textAlign="center">Create New User</DialogTitle>

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
                else if (column.id == 'createdAt') return false;
                else if (column.id == 'roles') return false;
                else if (column.accessorFn == 'fullname') return false;

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
              <InputLabel id="roles">Roles</InputLabel>
              <Select
                labelId="roles"
                id="roles"
                // value={ss}
                label="Roles"
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <MenuItem value={'STORE_MANAGER'}>Store Manager</MenuItem>
                <MenuItem value={'BANK_AGENT'}>Bank agent</MenuItem>
                <MenuItem value={'ADMIN'}>Admin </MenuItem>
              </Select>
            </FormControl>
            {selectedOption === 'STORE_MANAGER' ? (
              <FormControl fullWidth>
                <InputLabel id="store">Store </InputLabel>
                <Select
                  labelId="store"
                  id="store"
                  // value={ss}
                  label="store"
                  onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                >
                  <MenuItem value={'FNAC'}>fnac</MenuItem>
                  <MenuItem value={'DARTY'}>darty</MenuItem>
                  <MenuItem value={'ADMIN'}>Admin </MenuItem>
                  {subOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            <TextField
              label="password"
              name="password"
              type="text"
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
          Create New User
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;

export default UserDataTable;