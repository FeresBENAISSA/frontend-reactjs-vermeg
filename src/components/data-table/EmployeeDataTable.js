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
import { selectCurrentToken, selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import useAxios from '../../api/axios';
import {
  ADMIN,
  AVAILABLE_STORES_URL,
  BANK_AGENT,
  BASE_URL,
  STORE_EMPLOYEE,
  STORE_MANAGER,
  USERS_URL,
} from '../../Constants';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreateNewEmployeeModal } from '../CreateModals/createNewEmployeeModal';
import { UpdateEmployeeModal } from '../UpdateModals/updateEmployeeModal';

const userImage = require('./avatar_1.jpg');

const UserDataTable = () => {
  const token = useSelector(selectCurrentToken);
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
      console.log(users);
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
      console.log(values)
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
    const roles = [STORE_EMPLOYEE];
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    formData.append('storeId', user.store);
    formData.append('roles', roles);
    console.log(formData);
    await createUser(formData);
    getUsers();
  };

const handleUpdateRow = async (values) => {
    console.log(values);
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

  const handleCancelRowEdits = () => {
    setValidationErrors({});
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
      // {
      //   accessorFn: (row) => `${row.firstname} ${row.lastname}`, //accessorFn used to join multiple data into a single cell
      //   id: 'name', //id is still required when using accessorFn instead of accessorKey
      //   header: 'Full Name',
      //   size: 250,
      //   Cell: ({ renderedCellValue, row }) => (
      //     <Box
      //       sx={{
      //         display: 'flex',

      //         alignItems: 'center',

      //         gap: '1rem',
      //       }}
      //     >
      //       <img
      //         alt="avatar"
      //         height={40}
      //         width={40}
      //         src={row.original.avatar ? BASE_URL + row.original.avatar.split('\\')[1] : userImage}
      //         loading="lazy"
      //         style={{ borderRadius: '50%' }}
      //       />
      //       {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
      //       <span>{renderedCellValue}</span>
      //     </Box>
      //   ),
      // },
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
            <img src="./id.jpeg" />
          </Box>
        </Box>
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
            <Button
              color="error"
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onClick={handleDeleteAll}
              variant="contained"
            >
              Delete Selected
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

// export const CreateNewUserModal = ({ open, columns, onClose, onSubmit }) => {
//   // const [addProduct] = useAddProductMutation();
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [subOptions, setSubOptions] = useState([]);
//   const ImageInput = useRef();
//   const [selectedImage, setSelectedImage] = useState(null);
//   const api = useAxios();
//   const handleButtonClick = () => {
//     ImageInput.current.click();
//   };
//   const getAvailableStores = async () => {};
//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'image/png') {
//       setSelectedImage(file);
//       setValues({ ...values, [event.target.name]: file });
//     } else {
//       setSelectedImage(null);
//       alert('Please select a valid PNG file');
//     }
//   };

//   const [values, setValues] = useState(() =>
//     columns.reduce((acc, column) => {
//       // console.log(column);
//       acc[column.accessorKey ?? ''] = '';
//       return acc;
//     }, {})
//   );

//   const handleSubmit = async (e) => {
//     //put your validation logic here
//     //change role string to table
//     const roles = [];
//     roles.push(values.roles);
//     values.roles = roles;
//     console.log(values);
//     onSubmit(values);
//     onClose();
//   };

//   return (
//     <Dialog open={open}>
//       <DialogTitle textAlign="center">Create New Employee</DialogTitle>

//       <DialogContent>
//         <form onSubmit={(e) => e.preventDefault()}>
//           <Stack
//             sx={{
//               width: '100%',
//               minWidth: { xs: '300px', sm: '360px', md: '400px' },
//               gap: '1.5rem',
//             }}
//           >
//             {' '}
//             {/* <TextField
//               label="firstname"
//               name="firstname"
//               type="text"
//               onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//             />
//             <TextField
//               label="lastname"
//               name="lastname"
//               type="text"
//               onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//             /> */}
//             {columns
//               .filter((column) => {
//                 if (column.accessorKey == '_id') return false;
//                 else if (column.accessorKey == 'avatar') return false;
//                 else if (column.id == 'createdAt') return false;
//                 else if (column.id == 'roles') return false;
//                 else if (column.id == 'name') return false;
//                 else return true;
//               })
//               .map((column) => (
//                 <TextField
//                   key={column.accessorKey == '' ? column.accessorKey : column.id}
//                   label={column.header}
//                   name={column.accessorKey !== '' ? column.accessorKey : column.id}
//                   type={column.type}
//                   onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//                 />
//               ))}
//             <FormControl fullWidth>
//               <InputLabel id="roles">Roles</InputLabel>
//               <Select
//                 labelId="roles"
//                 id="roles"
//                 name="roles"
//                 label="Roles"
//                 onChange={(e) => {
//                   setSelectedOption(e.target.value);
//                   setValues({ ...values, [e.target.name]: e.target.value });
//                 }}
//               >
//                 <MenuItem selected value={STORE_EMPLOYEE}>
//                   Store Employee{' '}
//                 </MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               label="password"
//               name="password"
//               type="text"
//               onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
//             />
//           </Stack>
//           <input
//             style={{ display: 'none' }}
//             accept="image/png"
//             id="avatar"
//             onChange={handleImageSelect}
//             name="avatar"
//             type="file"
//             ref={ImageInput}
//           />
//           <Button fullWidth variant="contained" onClick={handleButtonClick} sx={{ mt: 2 }} color="info">
//             Select user avatar
//           </Button>
//           {selectedImage && (
//             <>
//               <Typography color="text.secondary" variant="body2">
//                 Selected Image: {selectedImage.name}
//               </Typography>

//               {/* <Button fullWidth variant="text" onClick={handleUpload}>
//                 Upload
//               </Button> */}
//             </>
//           )}
//         </form>
//       </DialogContent>

//       <DialogActions sx={{ p: '1.25rem' }}>
//         <Button onClick={onClose}>Cancel</Button>

//         <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
//           Create New Employee
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
const validateRequired = (value) => !!value.length;

export default UserDataTable;
