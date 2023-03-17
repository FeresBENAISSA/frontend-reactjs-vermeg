import React, { useMemo, useState, useCallback } from 'react';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Delete, Edit } from '@mui/icons-material';

//Material-UI Imports
import { Box, Button, ListItemIcon, MenuItem, Typography, TextField, Tooltip, IconButton, Alert } from '@mui/material';

//Date Picker Imports
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ExportToCsv } from 'export-to-csv';
//Icons Imports
import { AccountCircle, Send } from '@mui/icons-material';

//Mock Data
// import { data } from './makeData';
const data = [
  {
    id: 1,
    firstName: 'feres',
    lastName: 'aaaaaa',
    email: 'string',
    jobTitle: 'string',
    salary: 50000,
    startDate: '12/02/2002',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
  {
    id: 2,
    firstName: 'mazen',
    lastName: 'bbbbb',
    email: 'string',
    jobTitle: 'string',
    salary: 60000,
    startDate: '12/02/2020',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
  {
    id: 3,
    firstName: 'yessine',
    lastName: 'yyyyy',
    email: 'string',
    jobTitle: 'string',
    salary: 501,
    startDate: '15/02/2005',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
  {
    id: 4,
    firstName: 'sawsen ',
    lastName: 'sssss',
    email: 'string',
    jobTitle: 'string',
    salary: 0,
    startDate: 'string',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
  {
    id: 5,
    firstName: '3ala',
    lastName: 'aaaaaass',
    email: 'string',
    jobTitle: 'string',
    salary: 8888,
    startDate: 'string',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
  {
    id: 6,
    firstName: 'mohsen ',
    lastName: 'moooo',
    email: 'string',
    jobTitle: 'string',
    salary: 999999,
    startDate: 'string',
    signatureCatchPhrase: 'string',
    avatar: require('./avatar_1.jpg'),
    identification: require('./id.jpeg'),
    credit: require('./creditcard.jpeg'),
  },
];

const Example = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!window.confirm(`Are you sure you want to delete ${row.getValue('firstname')}`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );


  const columns = useMemo(
    () => [
      {
        id: 'employee', //id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
            id: 'name', //id is still required when using accessorFn instead of accessorKey
            header: 'Name',
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
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                />
                {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            header: 'Email',
            size: 300,
          },
        ],
      },
      {
        id: 'id',
        header: 'Job Info',
        columns: [
          {
            accessorKey: 'salary',
            header: 'Salary',
            size: 200,
            //custom conditional format and styling
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue() < 50_000
                      ? theme.palette.error.dark
                      : cell.getValue() >= 50_000 && cell.getValue() < 75_000
                      ? theme.palette.warning.dark
                      : theme.palette.success.dark,
                  borderRadius: '0.25rem',
                  color: '#fff',
                  maxWidth: '9ch',
                  p: '0.25rem',
                })}
              >
                {cell.getValue()?.toLocaleString?.('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
          {
            accessorKey: 'jobTitle', //hey a simple column for once
            header: 'Job Title',
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
            id: 'startDate',
            header: 'Start Date',
            filterFn: 'lessThanOrEqualTo',
            sortingFn: 'datetime',
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
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      editingMode="modal"
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
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
          <img alt="id" height={150} src={row.original.identification} loading="lazy" />
          <img alt="bank card" height={150} src={row.original.credit} loading="lazy" />
          {/* style={{ borderRadius: '50%' }} */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4">Signature Catch Phrase:</Typography>
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
        const handleDeactivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('deactivating ' + row.getValue('name'));
          });
        };

        const handleActivate = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('activating ' + row.getValue('name'));
          });
        };

        const handleContact = () => {
          table.getSelectedRowModel().flatRows.map((row) => {
            alert('contact ' + row.getValue('name'));
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
            {/* <Button
              color="primary"
              //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
              onClick={handleExportData}
              variant="contained"
            >
              Export All Data
            </Button> */}
            

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
            <Button
              color="success"
              disabled={!table.getIsSomeRowsSelected()}
              onClick={handleActivate}
              variant="contained"
            >
              Activate
            </Button>
            <Button color="info" disabled={!table.getIsSomeRowsSelected()} onClick={handleContact} variant="contained">
              Contact
            </Button>
          </div>
        );
      }}
    />
  );
};

export default Example;
