import React, { useMemo, useState, useCallback, useEffect } from 'react';
//MRT Imports
import MaterialReactTable from 'material-react-table';
//Material-UI Imports
import {
  Box,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Delete,
  Edit,
} from '@mui/icons-material';
// import API
import useAxios from '../../api/axios';
import { CATEGORY_URL } from '../../Constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';

import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CreateNewCategoryModal } from '../CreateModals/createNewCategoryModal';
import { UpdateCategoryModal } from '../UpdateModals/updateCategoryModal';
import { ExportToCsv } from 'export-to-csv';

const CategoryDataTable = () => {
  const user = useSelector(selectCurrentUser);
  const [data, setData] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [tableData, setTableData] = useState([]);
  const api = useAxios();
  const [rowToUpdate, setRowToUpdate] = useState({});
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  const getCategories = async () => {
    try {
      const response = await api.get(`${CATEGORY_URL}/store/${user.store}`);
      if (!response?.data) throw Error('no data found');
      const categories = response.data;
      // console.log(categories);
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
    // console.log(response);
    if (response.status === 201 || response.status === 200) {
      toast.success('operation successfully completed');
    } else {
      toast.error('Error occured');
    }
  };

  const handleCreateNewRow = async (values) => {
    // console.log(values);
    values.storeId = user.store;
    await createCategory(values);
    getCategories();
  };
  const handleUpdateRow = async (values) => {
    // console.log(values);
    values.storeId = user.store;
    await updateCategory(values);
    getCategories();
  };
 
  const handleDeleteRow = useCallback(
    (row) => {
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

 

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id', //simple recommended way to define a column
        header: 'ID',
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
        // <Button color="secondary" onClick={() => setCreateModalOpen(true)} variant="contained"></Button>;

        const handleDeleteAll = () => {
          setModalContent({
            title: 'Delete Brand',
            content: 'Are you sure you want to delete selected categories?',
            actionText: 'Delete',
            denyText: 'Cancel',
            handleClick: () => {
              table.getSelectedRowModel().flatRows.map((row) => {
                //send api delete request here, then refetch or update local table data for re-render
                deleteCategory(row.getValue('_id'));
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
              Delete selected
            </Button>
            <UpdateCategoryModal
              open={updateModalOpen}
              onClose={() => setUpdateModalOpen(false)}
              onSubmitModal={handleUpdateRow}
              row={rowToUpdate}
            />
            <CreateNewCategoryModal
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

export default CategoryDataTable;
