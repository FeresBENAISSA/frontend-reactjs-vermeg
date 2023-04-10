import { Helmet } from 'react-helmet-async';
// @mui
import { Card, Stack, Container, Typography } from '@mui/material';
// components
import CategoryDataTable from '../../components/data-table/CategoryDataTable';

// ----------------------------------------------------------------------

export default function CategoryPage() {
  return (
    <>
      <Helmet>
        <title> Category</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
          Category
          </Typography>
        </Stack>

        <Card>
          <CategoryDataTable/>
        </Card>
      </Container>
    </>
  );
}
