import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import EmployeeDataTable from '../../components/data-table/EmployeeDataTable';

// ----------------------------------------------------------------------

export default function StoreEmployeePage() {
  return (
    <>
      <Helmet>
        <title> Employees </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Employees
          </Typography>
        </Stack>

        <Card>
          <EmployeeDataTable />
        </Card>
      </Container>
    </>
  );
}
