import { Helmet } from 'react-helmet-async';


// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
} from '@mui/material';

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
          <UserDataTable />
        </Card>
      </Container>
    </>
  );
}
