import React, { useMemo, useState, useCallback, useEffect } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';

//Material-UI Imports
import {
  Box,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';

import { ExportToCsv } from 'export-to-csv';
// import API
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import {
  BASE_URL,
  STORE_EMPLOYEE,
  USERS_URL,
} from '../../Constants';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateNewEmployeeModal } from '../CreateModals/createNewEmployeeModal';
import { UpdateEmployeeModal } from '../UpdateModals/updateEmployeeModal';

const userImage = require('./avatar_1.jpg');

const UserDataTable = () => {
  const user = useSelector(selectCurrentUser);
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
      const response = await api.get(`${USERS_URL}/store/${user.store}`);
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
      const response = await api.put(USERS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createUser = async (values) => {
    try {
      // console.log(values)
      const response = await api.post(USERS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
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
    const roles = [STORE_EMPLOYEE];
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append('storeId', user.store);
    formData.append('roles', roles);
    // console.log(formData);
    await createUser(formData);
    getUsers();
  };

const handleUpdateRow = async (values) => {
    // console.log(values);
    delete values.roles;
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    console.log(formData);
    await updateUser(formData);
    getUsers();
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


  const handleDeleteRow = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to delete ${row.getValue('_id')}`)) {
      //   return;
      // }
      //send api delete request here, then refetch or update local table data for re-render
      setModalContent({
        title: 'Delete Employee',
        content: 'Are you sure you want to delete this employe?',
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
      {
        accessorKey: 'phoneNumber', //simple recommended way to define a column
        header: 'Phone Number',
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
        const handleExportRows = (rows) => {
          csvExporter.generateCsv(rows.map((row) => row.original));
        };
        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button color="info" onClick={() => setCreateModalOpen(true)} variant="contained">
              Create New Employee
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
            <UpdateEmployeeModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewEmployeeModal
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
