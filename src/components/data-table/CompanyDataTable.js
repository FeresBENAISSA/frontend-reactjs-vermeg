import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';
import * as yup from 'yup';

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
import { BASE_URL, COMPANIES_URL } from '../../Constants';
import { number } from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from './AlertDialog';
import { CreateNewCompanyModal } from '../CreateModals/createNewCompanyModal';
import { UpdateCompanyModal } from '../UpdateModals/updateCompanyModal';

const companyImage = require('./avatar_1.jpg');

const CompanyDataTable = () => {
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();

  const getCompanies = async () => {
    try {
      const response = await api.get(COMPANIES_URL);
      if (!response?.data) throw Error('no data found');
      const companies = response.data;
      console.log(companies);
      setData(companies);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCompany = async (id) => {
    try {
      const response = await api.delete(`${COMPANIES_URL}/${id}`);
      await getCompanies();
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const updateCompany = async (values) => {
    try {
      const response = await api.put(COMPANIES_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  const createCompany = async (values) => {
    try {
      const response = await api.post(COMPANIES_URL, values);
      handleApiResponse(response);
    } catch (error) {
      toast.error('Failed');
    }
  };
  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // toast notification functions
  const handleApiResponse = (response) => {
    if (response.status === 201 || response.status === 200) {
      console.log(response.data);
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
    await createCompany(formData);
    getCompanies();
    // alert(' success ');
  };
  const handleUpdateRow = async (values) => {
    console.log(values);
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    console.log(formData);
    await updateCompany(formData);
    getCompanies();
    // alert(' success ');
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const roles = [];
      console.log(values);
      tableData[row.index] = values;
      //roles from string to table
      console.log(tableData[row.index].roles);
      //send/receive api updates here, then refetch or update local table data for re-render
      await updateCompany(tableData[row.index]);
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to delete ${row.getValue('companyLabel')}`)) {
      //   return;
      // }
      //send api delete request here, then refetch or update local table data for re-render
      setModalContent({
        title: 'Delete Company',
        content:
          'Are you sure you want to delete this company? Please note that deleting this company will also delete all the stores associated with it',
        actionText: 'Delete',
        denyText: 'Cancel',
        handleClick: () => {
          deleteCompany(row.getValue('_id'));
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
        accessorKey: `companyLogo`, //accessorFn used to join multiple data into a single cell
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
              src={row.original.companyLogo ? BASE_URL + row.original.companyLogo.split('\\')[1] : companyImage}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />
          </Box>
        ),
      },
      {
        accessorKey: 'companyLabel', //simple recommended way to define a column
        header: 'Label',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'companyDescription', //simple recommended way to define a column
        header: 'Description',
      },
      {
        accessorKey: 'companyAddress', //simple recommended way to define a column
        header: 'Address',
      },
      {
        accessorKey: 'companyPhoneNumber', //simple recommended way to define a column
        header: 'Phone Number',
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
        <>
          {/* <table>
            <tr>
              <th>storeLabel</th>
              <th>storeAddress</th>
              <th>storeLabel</th>
            </tr>
              {row.original.companyStores.map((store) => (
                  // <Typography variant="h6">{store.storeLabel} : </Typography>
                  <tr>
                  <td>{store.storeLabel}</td>
                  <td>{store.storeAddress}</td>
                  <td>{store.storeLabel}</td>
                </tr>
              ))}
          </table> */}
        </>
        // <Box
        //   sx={{
        //     display: 'flex',
        //     justifyContent: 'space-evenly',
        //     alignItems: 'center',
        //   }}
        // >
        //   {' '}
        //   <Typography variant="h6">Logo of {row.original.companyLabel}: </Typography>
        //   <br />
        //   <img
        //     alt="image"
        //     height={150}
        //     src={row.original.companyLogo ? BASE_URL + row.original.companyLogo.split('\\')[1] : companyImage}
        //     loading="lazy"
        //   />
        //   {/* <img alt="bank card" height={150} src={row.original.storeLogo ? BASE_URL+row.original.storeLogo.split('\\')[1] : companyImage} loading="lazy" /> */}
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
            title: 'Delete Companies',
            content: 'Are you sure you want to delete all Compnies\nPlease note that deleting a company will also delete all the stores associated with it',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteCompany(row.getValue('_id'));
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
              Create New Company
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
            <UpdateCompanyModal
              row={rowToUpdate}
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
            />
            <CreateNewCompanyModal
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

export default CompanyDataTable;
