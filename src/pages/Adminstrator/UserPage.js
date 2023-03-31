import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import Modal from '@mui/material/Modal/';

// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
} from '@mui/material';
// components
// import Label from '../../components/label';
// import Iconify from '../../components/iconify';
// import Scrollbar from '../../components/scrollbar';
// sections
// import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
// import USERLIST from '../../_mock/user';
// import Example from '../../components/data-table/dataTablev2';
import UserDataTable from '../../components/data-table/UserDataTable';

export default function UserPage() {

  return (
    <>
      <Helmet>
        <title> Users </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Manage Users
          </Typography>
        </Stack>

        <Card>
          {/* <Example/> */}
          <UserDataTable />
        </Card>
      </Container>
    </>
  );
}
