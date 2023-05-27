import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

//MRT Imports
import MaterialReactTable from 'material-react-table';
import { Close, Done, Timer } from '@mui/icons-material';
import * as yup from 'yup';

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
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Grid,
  DialogContentText,
  Alert,
  CircularProgress,
} from '@mui/material';

import { ExportToCsv } from 'export-to-csv';
// import API
import useAxios from '../../api/axios';
import { CREDITS_URL } from '../../Constants';
import LegalFile from './LegalFile';
import Information from './Information';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import AlertDialog from './AlertDialog';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CreditApplicationDataTable = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const api = useAxios();
  const user = useSelector(selectCurrentUser);
  // approuve credit application
  const [processing, setProcessing] = useState(false);

  // api's
  const getCredits = async () => {
    try {
      const response = await api.get(`${CREDITS_URL}/bank`);
      if (!response?.data) throw Error('no data found');
      const credits = response.data;
      // console.log(credits);
      setData(credits);
    } catch (error) {
      console.log(error);
    }
  };
  const updateApprouve = async (row, comment) => {
    setProcessing(true);
    const values = {};
    values.creditId = row.original._id;
    values.bankAgentId = user._id;
    values.comment = comment;
    try {
      const response = await api.put(`${CREDITS_URL}/waitingforsignature`, values);
      // console.log(response);
      handleApiResponse(response);
      getCredits();
    } catch (error) {
      toast.error('Failed ');
    } finally {
      setProcessing(false);
    }
  };

  const updateReject = async (row, comment) => {
    const values = {};
    values.creditId = row.original._id;
    values.comment = comment;
    // console.log(values);
    try {
      const response = await api.put(`${CREDITS_URL}/rejected`, values);
      handleApiResponse(response);
      getCredits();
    } catch (error) {
      toast.error('Failed ');
    }
  };
  const postponeApplication = async (row, comment) => {
    const values = {};
    values.creditId = row.original._id;
    values.comment = comment;
    // console.log(values);
    try {
      const response = await api.post(`${CREDITS_URL}/postpone`, values);
      handleApiResponse(response);
      getCredits();
    } catch (error) {
      toast.error('Failed ');
    }
  };


  useEffect(() => {
    getCredits();
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  // toast notification functions
  const handleApiResponse = (response) => {
    if (response.status === 201) {
      toast.success(response.data);
    } else {
      toast.error('Error occured');
    }
  };

  const approuveCreditApplication = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to approuve ${row.getValue('_id')}`)) {
      //   return;
      // }
      setModalContent({
        title: 'Approve Application',
        content: 'Are you sure you want to approve this application?',
        actionText: 'Approve',
        denyText: 'Cancel',
        handleClick: (comment) => {
          // console.log(comment);
          updateApprouve(row, comment);
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: true,
      });

      // send api delete request here, then refetch or update local table data for re-render
      // deleteCompany(row.getValue('_id'));
    },
    [tableData]
  );

  const denyCreditApplication = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to deny ${row.getValue('_id')}`)) {
      //   return;
      // }
      //send api delete request here, then refetch or update local table data for re-render
      setModalContent({
        title: 'Deny Application',
        content: 'Are you sure you want to deny this application?',
        actionText: 'Deny',
        denyText: 'Cancel',
        handleClick: (comment) => {
          updateReject(row, comment);
          setModalContent(null);
        },
        handleClose: () => {
          setModalContent(null);
        },
        requireComment: true,
      });
      // deleteCompany(row.getValue('_id'));
    },
    [tableData]
  );

  const delayCreditApplication = useCallback(
    (row) => {
      // if (!window.confirm(`Are you sure you want to deny ${row.getValue('_id')}`)) {
      //   return;
      // }
      setModalContent({
        title: 'Postpone Application',
        content: 'Are you sure you want to delay this application?',
        actionText: 'Delay',
        denyText: 'Cancel',
        handleClick: (comment) => {
          postponeApplication(row, comment)
          // console.log(comment);
          setModalContent(null);
        },

        handleClose: () => {
          setModalContent(null);
        },
        requireComment: false,
      });

      //send api delete request here, then refetch or update local table data for re-render
      // deleteCompany(row.getValue('_id'));
    },
    [tableData]
  );

  const columns = useMemo(() => [
    {
      accessorKey: '_id', //simple recommended way to define a column
      header: 'ID',
    },
    {
      accessorKey: 'state', //simple recommended way to define a column
      header: 'State',
      Cell: ({ cell }) => (
        <Box
          component="span"
          sx={(theme) => ({
            backgroundColor:
              cell.getValue() === 'WAITING_FOR_VALIDATION'
                ? theme.palette.secondary.main
                : cell.getValue() === 'WAITING_FOR_SIGNATURE'
                ? theme.palette.secondary.light
                : cell.getValue() === 'SIGNING'
                ? theme.palette.warning.main
                : cell.getValue() === 'CLOSING'
                ? theme.palette.success.dark
                : cell.getValue() === 'REJECTED'
                ? theme.palette.error.dark
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
  ]);

  // const csvExporter = new ExportToCsv(csvOptions);
  // let content;

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enableFullScreenToggle={false}
        editingMode="modal"
        enableColumnFilterModes
        enableColumnOrdering
        enableGrouping
        enablePinning
        state={{ showProgressBars: processing }}
        // onEditingRowSave={handleSaveRowEdits}
        enableRowActions
        enableRowSelection
        initialState={{ showColumnFilters: false }}
        positionToolbarAlertBanner="bottom"
        renderDetailPanel={({ row }) => (
          <>
            <Grid  container spacing={0}>
              <Grid  item xs={4}>
                {row.original.client ? (
                  <ImageList key ={uuidv4()} variant="masonry" cols={1} gap={8}>
                    {row.original.client?.legalDocument?.map((document,index) => (
                      <>
                        <ImageListItem key={document+uuidv4()}>

                          <LegalFile document={document} />
                          {/* <ImageListItemBar position="below" title={'item.author'} /> */}
                        </ImageListItem>
                      </>
                    ))}
                  </ImageList>
                ) : null}
              </Grid>
              <Grid key ={uuidv4()} item xs={1}></Grid>
              <Grid  key ={uuidv4()}item xs={7}>
                <Information row={row.original} />
              </Grid>
            </Grid>
          </>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip
              arrow
              placement="left"
              title="Edit"
              disabled={row.original.state === 'WAITING_FOR_VALIDATION' ? false : true}
            >
              <IconButton
                // disabled={row.original.state === 'WAITING_FOR_VALIDATION' ? false : true}
                color="success"
                onClick={() => approuveCreditApplication(row)}
              > <>
                <Done />
                </>
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              placement="right"
              title="Delete"
              disabled={row.original.state === 'WAITING_FOR_VALIDATION' ? false : true}
            >
              <IconButton
                // disabled={row.original.state === 'WAITING_FOR_VALIDATION' ? false : true}
                color="warning"
                onClick={() => delayCreditApplication(row)}
              ><>
                <Timer />
                </>
              </IconButton>
            </Tooltip>
            <Tooltip
              arrow
              placement="right"
              title="Delete"
              disabled={row.original.state === 'WAITING_FOR_VALIDATION' ? false : true}
            >
              <IconButton
                // disabled={row.original.state === 'REJECTED' ||row.original.state === 'WAITING_FOR_SIGNATURE' || row.original.state === 'SIGNED'? true : false}
                color="error"
                onClick={() => denyCreditApplication(row)}
              > <>
                <Close />
                </>
              </IconButton>
            </Tooltip>
            {/* {processing && <CircularProgress />} */}
          </Box>
        )}
        // renderTopToolbarCustomActions={({ table }) => {
        //   const handleExportRows = (rows) => {
        //     csvExporter.generateCsv(rows.map((row) => row.original));
        //   };
        //   return (
        //     <div style={{ display: 'flex', gap: '0.5rem' }}>
        //       <Button
        //         color="warning"
        //         disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        //         //only export selected rows
        //         onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        //         variant="contained"
        //       >
        //         Export Selected Rows
        //       </Button>
        //     </div>
        //   );
        // }}
      />
      {modalContent && <AlertDialog {...modalContent} />}
      {/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
      <ToastContainer position="bottom-right" />
    </div>
  );
};
const validateRequired = (value) => !!value.length;
export default CreditApplicationDataTable;
