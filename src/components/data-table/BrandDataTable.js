// using react bib
import React, { useMemo, useState, useCallback, useEffect } from 'react';
//MRT Imports
import MaterialReactTable from 'material-react-table';
//Material-UI Imports
import { Box, Button, Tooltip, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
// import API
import useAxios from '../../api/axios';
import { BASE_URL, BRANDS_URL } from '../../Constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
// Imports modal for Create and Brand
import { CreateNewBrandModal } from '../CreateModals/createNewBrandModal';
import { UpdateBrandModal } from '../UpdateModals/updateBrandModal';
// Imports export data Table
import { ExportToCsv } from 'export-to-csv';
// Imports for Alert after reciving a response 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AlertDialog from './AlertDialog';

const BrandDataTable = () => {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState([]);
  const api = useAxios();
  // API'S CRUD
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
  };
  const updateBrand = async (values) => {
    try {
      const response = await api.put(BRANDS_URL, values);
      handleApiResponse(response);
    } catch (error) {
      console.log(error);
      toast.error('Failed');
    }
  };

  const createBrand = async (values) => {
    try {
      const response = await api.post(BRANDS_URL, values);
      console.log(response);
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
      toast.success('Operation successfully completed');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    console.log(values);
    values.storeId = user.store;
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    // formData.append('storeId', user.store);
    console.log(formData);
    await createBrand(formData);
    getBrands();
  };
  const handleUpdateRow = async (values) => {
    console.log(values);
    // console.log(values);
    values.storeId = user.store;
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    // formData.append('storeId', user.store);
    console.log(formData);
    await updateBrand(formData);
    getBrands();
  };

  const handleDeleteRow = useCallback(
    (row) => {
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

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id', //simple recommended way to define a column
        header: 'ID',
        enableEditing: false,
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
      },
      {
        accessorKey: 'description', //simple recommended way to define a column
        header: 'Description',
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
      data={tableData}
      enableFullScreenToggle={false}
      editingMode="modal"
      enableColumnFilterModes
      enableColumnOrdering
      enableGrouping
      enablePinning
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

        const handleDeleteAll = () => {
          setModalContent({
            title: 'Delete Brand',
            content: 'Are you sure you want to delete all brands?',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteBrand(row.getValue('_id'));
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
            <UpdateBrandModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewBrandModal
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
export default BrandDataTable;
