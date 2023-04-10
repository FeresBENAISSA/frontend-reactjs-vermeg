import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
} from '@mui/material';
import CreditApplicationDataTable from '../../components/data-table/CreditApplicationDataTable';

// ----------------------------------------------------------------------
 
export default function CreditApplication() {
  return (
    <>
      <Helmet>
        <title> Credit Applications  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Manage Credit 
          </Typography>
        </Stack>

        <Card>
          <CreditApplicationDataTable />
        </Card>
      </Container>
    </>
  );
}
