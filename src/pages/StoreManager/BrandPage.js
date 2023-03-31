import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal/';

// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import CategoryDataTable from '../../components/data-table/CategoryDataTable';
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
