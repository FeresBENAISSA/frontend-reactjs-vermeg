import { Helmet } from 'react-helmet-async';
import { useState,useEffect } from 'react';
// @mui
import { Container, Stack, Typography ,Grid} from '@mui/material/';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products';
// mock
import PRODUCTS from '../../_mock/products';
import AccountProfile from '../../sections/@dashboard/account/AccountProfile';
import { AccountProfileDetails } from '../../sections/@dashboard/account/AccountProfileDetails';
import { useSelector } from 'react-redux';
import { selectCurrentUsername } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';

// ----------------------------------------------------------------------

export default function BankProfile() {
  const [openFilter, setOpenFilter] = useState(false);
  const username = useSelector(selectCurrentUsername);
  const [user,setUser] = useState()
  const api = useAxios();
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const getUser =async()=> {
    const response = await api.get(`/users/${username}`,)
    console.log(response.data)
    setUser(response.data);

  }

  useEffect(()=>{
    getUser();
  })


if(user)
  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          Products
        </Typography> */}

        {/* <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        <ProductCartWidget /> */}
       
         <Stack spacing={3}>
          <div>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Profile
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile user={user} />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <AccountProfileDetails user={user} />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </>
  )
  else(
    <></>
  )
}
