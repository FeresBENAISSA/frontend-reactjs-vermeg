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
import { ADMIN, AUTH_KEY, AVAILABLE_STORES_URL, BANK_AGENT, BASE_URL, STORE_MANAGER, USERS_URL } from '../../Constants';
import { CometChat } from '@cometchat-pro/chat';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateNewUserModal } from '../CreateModals/createNewUserModal';
import { UpdateBrandModal } from '../UpdateModals/updateBrandModal';
import { UpdateUserModal } from '../UpdateModals/updateUserModal';
const userImage = require('./avatar_1.jpg');

const UserDataTable = () => {
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();

  const getUsers = async () => {
    try {
      const response = await api.get(USERS_URL);
      if (!response?.data) throw Error('no data found');
      const users = response.data;
      // console.log(users);
      setData(users);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await api.delete(`${USERS_URL}/${id}`);
      await getUsers();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const updateUser = async (values) => {
    try {
      // console.log(values)
      const response = await api.put(USERS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };

  const createUser = async (values) => {
    try {
      const response = await api.post(USERS_URL, values);
      const userDb = response.data;
      if (response.data) {
        var UID = userDb._id;
        var name = userDb.firstname;
        var avatar = BASE_URL + userDb.avatar.split('\\')[1];
        var user = new CometChat.User(UID);
        user.setName(name);
        if (avatar) user.setAvatar(avatar);
        // console.log(userDb);
        // console.log(userDb.roles.includes('ADMIN'));

        if (userDb.roles.includes('ADMIN')||userDb.roles.includes('STORE_MANAGER')) {
          CometChat.createUser(user, AUTH_KEY).then(
            (user) => {
              console.log('user created', user);
            },
            (error) => {
              console.log('error', error);
            }
          );
        }
      } else {
        console.log('no');
      }
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
    // var user
  };
  useEffect(() => {
    getUsers();
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
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    // console.log(formData);
    await createUser(formData);
    getUsers();
  };
  const handleUpdateRow = async (values) => {
    console.log(values);
    delete values.roles;
    delete values.roles;

    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    console.log(formData);
    await updateUser(formData);
    getUsers();
  };

 

  const handleDeleteRow = useCallback(
    (row) => {
      setModalContent({
        title: 'Delete User',
        content: 'Are you sure you want to delete this User?',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteUser(row.getValue('_id'));
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });
      //send api delete request here, then refetch or update local table data for re-render
    
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
        accessorKey: `avatar`, //accessorFn used to join multiple data into a single cell
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
              src={row.original.avatar ? BASE_URL + row.original.avatar.split('\\')[1] : userImage}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'firstname', //simple recommended way to define a column
        header: 'firstname',
      },
      {
        accessorKey: 'lastname', //simple recommended way to define a column
        header: 'lastname',
      },
      
      {
        accessorKey: 'username', //simple recommended way to define a column
        header: 'Username',

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
      {
        accessorKey: 'phoneNumber', //simple recommended way to define a column
        header: 'Phone Number',
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

  const csvExporter = new ExportToCsv(csvOptions);
  // let content;
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
      // onEditingRowSave={handleSaveRowEdits}
      enableRowActions
      enableRowSelection
      initialState={{ showColumnFilters: false }}
      positionToolbarAlertBanner="bottom"
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
            title: 'Delete Users',
            content: 'Are you sure you want to delete all selected Users?',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteUser(row.getValue('_id'));
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

        // const handleExportData = () => {
        //   csvExporter.generateCsv(data);
        // };

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
              Delete selected
            </Button>
            <UpdateUserModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewUserModal
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


const validateRequired = (value) => !!value.length;

export default UserDataTable;
