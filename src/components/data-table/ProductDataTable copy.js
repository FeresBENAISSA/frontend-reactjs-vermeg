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
} from '@mui/material';

//Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExportToCsv } from 'export-to-csv';
//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';
// import API
import axios from '../../api/axios';

import { selectCurrentToken } from '../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';
import {
  useGetProductsQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../../redux/features/product/productApiSlice';
import { createProduct, fetchProducts } from '../../redux/features/product/productAPI';
import { setDate } from 'date-fns';
import useAxios from '../../api/axios';

const productImage = require('./avatar_1.jpg');
const PRODUCT_URL = '/products';

// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpZml4ZCIsInJvbGVzIjpbIkFETUlOIiwiU1RPUkVfTUFOQUdFUiJdLCJpYXQiOjE2Nzg2MzYyMjIsImV4cCI6MTY3ODcyMjYyMn0.XE5fqcFFbQ5khN1vwykRxb-U8k8fEMmF8Gltk5EyJ2w';
const ProductDataTable = () => {
  // const { data: products, isLoading, isSuccess, isError, error } = useGetProductsQuery();
  // const [deleteProduct] = useDeleteProductMutation();
  // const [updateProduct] = useUpdateProductMutation();
  const token = useSelector(selectCurrentToken);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const api = useAxios();
  const fetchProducts = async () => {
    try {
      const response = await api.get(PRODUCT_URL);
      //   {
      //   headers: { Authorization: `Bearer ${token}`, roles: ['ADMIN', 'STORE_MANAGER'] },
      // });
      if (!response?.data) throw Error('no data found');
      const products = response.data;
      console.log(products);
      setData(products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleCreateNewRow = async (values) => {
    api.post(PRODUCT_URL, values).then(() => {
      tableData.push(values);
      setTableData([...tableData]);
    });
    // createProduct(values, token);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      console.log(values);
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      const response = await api.put(PRODUCT_URL, tableData[row.index]);
      // {
      //   headers: { Authorization: `Bearer ${token}`, roles: ['ADMIN', 'STORE_MANAGER'] },
      // });
      // await updateProduct(tableData[row.index]);

      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
      // window.location.reload(true);
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };
  const deleteProduct = async (id) => {
    await api.delete(`${PRODUCT_URL}/${id}`);

    //   {
    //     headers: { Authorization: `Bearer ${token}`, roles: ['ADMIN', 'STORE_MANAGER'] },
    //   });
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!window.confirm(`Are you sure you want to delete ${row.getValue('productLabel')}`)) {
        return;
      }
      // deleteProduct({ id: row.original._id })
      //   .then((reponse) => {
      //     console.log(reponse);
      //     tableData.splice(row.index, 1);
      //     setTableData([...tableData]);
      //   })
      //   .catch((err) => console.log(err));

      //  console.log(result)
      // deleteProduct(row.getValue('_id'))
      //send api delete request here, then refetch or update local table data for re-render
      deleteProduct(row.getValue('_id'));

      // window.location.reload(true);
    },
    [tableData]
  );
  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = cell.column.id === 'label' ? validateRequired(event.target.value) : true;
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
        accessorKey: 'productLabel', //simple recommended way to define a column
        header: 'Label',
      },

      // {
      //   accessorFn: (row) => `${row.productImage} `, //accessorFn used to join multiple data into a single cell
      //   id: 'productImage', //id is still required when using accessorFn instead of accessorKey
      //   header: 'Image',
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //   }),
      //   size: 250,
      //   enableClickToCopy: true,
      //   Cell: ({ renderedCellValue, row }) => (
      //     <Box
      //       sx={{
      //         display: 'flex',
      //         alignItems: 'center',
      //         gap: '1rem',
      //       }}
      //     >
      //       <img alt="avatar" height={30} src={productImage} loading="lazy" style={{ borderRadius: '50%' }} />
      //       {/* row.original.avatar */}
      //       {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
      //       <span>{renderedCellValue}</span>
      //     </Box>
      //   ),
      // },
      {
        accessorKey: 'productDescription', //simple recommended way to define a column
        header: 'Description',
      },
      {
        accessorKey: 'productReference', //simple recommended way to define a column
        header: 'Reference',
      },
      {
        accessorFn: (row) => `${row.productImage} `, //accessorFn used to join multiple data into a single cell
        id: 'productImage', //id is still required when using accessorFn instead of accessorKey
        header: 'Image',
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
              alt="product Image"
              height={30}
              src={row.productImage}
              loading="lazy"
              style={{ borderRadius: '50%' }}
            />

            {/* row.original.avatar */}
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
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

        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('deactivating ' + row.getValue('name'));
          });
        };

        // const handleActivate = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert('activating ' + row.getValue('name'));
        //   });
        // };

        // const handleContact = () => {
        //   table.getSelectedRowModel().flatRows.map((row) => {
        //     alert('contact ' + row.getValue('name'));
        //   });
        // };

        const handleExportRows = (rows) => {
          csvExporter.generateCsv(rows.map((row) => row.original));
        };

        const handleExportData = () => {
          csvExporter.generateCsv(data);
        };

        return (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              variant="contained"
            >
              Export All Data
            </Button> */}
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
              onClick={handleDeactivate}
              variant="contained"
            >
              Deactivate
            </Button>
            <CreateNewAccountModal
              columns={columns}
              open={createModalOpen}
              onClose={() => setCreateModalOpen(false)}
              onSubmit={handleCreateNewRow}
            />
            {/* <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="contained"
            >
              Activate
            </Button>
            <Button color="info" disabled={!table.getIsSomeRowsSelected()} onClick={handleContact} variant="contained">
              Contact
            </Button> */}
          </div>
        );
      }}
    />
  );
  // else return <p>{error}</p>;
};
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [addProduct] = useAddProductMutation();

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
      const response = await addProduct(values).unwrap();
    } catch (err) {
      console.log(err);
    }
    onSubmit(values);
    onClose();
    //  window.location.reload(true);
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Product</DialogTitle>

      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',

              minWidth: { xs: '300px', sm: '360px', md: '400px' },

              gap: '1.5rem',
            }}
          >
            <TextField
              label="Label"
              name="productLabel"
              type="text"
              onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
            />
            {columns
              .filter((column) => {
                if (column.accessorKey == '_id') return false;
                else if (column.id == 'createdAt') return false;
                else if (column.id == 'productLabel') return false;
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
        </form>
      </DialogContent>

      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button color="secondary" onClick={(e) => handleSubmit(e)} variant="contained">
          Create New Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const validateRequired = (value) => !!value.length;

export default ProductDataTable;
