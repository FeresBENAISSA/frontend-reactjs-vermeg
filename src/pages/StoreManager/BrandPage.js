import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import BrandDataTable from '../../components/data-table/BrandDataTable';

// ----------------------------------------------------------------------

export default function BrandPage() {
  return (
    <>
      <Helmet>
        <title> Category</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Brands
            {/* {
        products.map((product)=><p>{product.productLabel}</p>)
      } */}
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button> */}
        </Stack>

        <Card>
          <BrandDataTable/>
        </Card>
      </Container>
    </>
  );
}
