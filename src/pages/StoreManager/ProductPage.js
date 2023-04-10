import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import ProductDataTable from '../../components/data-table/ProductDataTable';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Products</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
        </Stack>

        <Card>
          <ProductDataTable />
        </Card>
      </Container>
    </>
  );
}
