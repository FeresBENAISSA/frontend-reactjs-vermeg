import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card, CardHeader, Box, Switch, Stack } from '@mui/material';
// sections
import {
  AppWebsiteVisits,
  AppWidgetSummary,
  AppConversionRates,
} from '../../sections/@dashboard/app';
// import BasicDetailPanels from 'src/components/data-table/dataTable';
// import Example from './../../components/data-table/dataTablev2';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import { useEffect, useState } from 'react';
import { STATS_URL } from '../../Constants';
import useAxios from '../../api/axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import useAxios from '../../api/axios';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const user = useSelector(selectCurrentUser);
  const welcome = user.firstname ? `welcome ${user.firstname}` : ' Hi, Welcome back';
  const api = useAxios();
  const current = new Date().getFullYear();
  const [revenueAndProfitYear, setRevenueAndProfitYear] = useState(`${current}`);
  const [revenueAndProfit, setRevenueAndProfit] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [avgWaitingPeriod, setAvgWaitingPeriod] = useState();
  const [avgCreditAmount, setAvgCreditAmount] = useState();
  const [checked, setChecked] = useState(true);




  
  const getTopProductsByStore = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/top-products-by-store`, object);
    setTopProducts(response.data);
  };

  const getTopCategoriesByStore = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/top-categories-by-store`, object);
    setTopCategories(response.data);
  };
  const getTopBrandsByStore = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/top-brands-by-store`, object);
    // console.log(response.data)
    setTopBrands(response.data);
  };
  const getTopEmployeesByStore = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/top-employees-by-store`, object);
    setTopEmployees(response.data);
  };
  const handleChangeYearForRevenueAndProfit = async (values) => {
    setRevenueAndProfit([]);
    const object = {
      date: values.$d,
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/revenue-and-profit-for-store`, object);
    setRevenueAndProfit(response.data);
  };

  const handleChangeYearForRevenueAndProfitByWeek = async (values) => {
    setRevenueAndProfit([]);
    const object = {
      date: values.$d,
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/revenue-and-profit-for-store-by-week`, object);
    // console.log(response)
    setRevenueAndProfit(response.data);
  };



  const averageWaitingPeriode = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/average-waiting-periode-for-store`, object);
    setAvgWaitingPeriod(response.data);
  };
  const averageCreditAmount = async () => {
    const object = {
      storeId: user.store,
    };
    const response = await api.post(`${STATS_URL}/average-credit-amount-for-store`, object);
    setAvgCreditAmount(response.data);
  };
  const handleChange = (event) => {
    setChecked(event.target.checked);
    // console.log(event.target.checked)
    if(event.target.checked===false) handleChangeYearForRevenueAndProfitByWeek({date: new Date() })
    else handleChangeYearForRevenueAndProfit({date: new Date() })
  };
  useEffect(() => {
    handleChangeYearForRevenueAndProfit({ date: new Date() });
    getTopProductsByStore();
    getTopCategoriesByStore();
    getTopBrandsByStore();
    getTopEmployeesByStore();
    averageWaitingPeriode();
    averageCreditAmount();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {welcome}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Average spending ammount per client"
              total={avgCreditAmount?.avgCreditAmount ? avgCreditAmount.avgCreditAmount : 0}
              color="success"
              icon={'solar:dollar-bold'}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Average waiting periode in minutes"
              total={avgWaitingPeriod?.avgWaitingPeriode ? avgWaitingPeriod.avgWaitingPeriode : 0}
              color="info"
              icon={'ic:outline-access-time-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Credit Application count"
              total={avgCreditAmount?.credits ? avgCreditAmount.credits : 0}
              color="secondary"
              icon={'mdi:form-outline'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Customer satisfaction rate"
              total={4.7}
              color="warning"
              icon={'material-symbols:star-rate-rounded'}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ p: 3, mb: 1 }}>
              <CardHeader
                title={`Monthly Revenue and Net Profit: [${revenueAndProfitYear}]`}
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    {checked?(
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="pick a year"
                        views={['year']}
                        onChange={(newValue) => {
                          setRevenueAndProfitYear(newValue.$y);
                          handleChangeYearForRevenueAndProfit(newValue);
                        }}
                      />
                    </LocalizationProvider>):null}

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ pl: 3}}>
                      <Typography>Weekly</Typography>
                      <Switch checked={checked} onChange={handleChange}  inputProps={{ 'aria-label': 'controlled' }} />
                      <Typography>Monthly</Typography>
                    </Stack>
                  </Box>
                }
              />
              <AppWebsiteVisits
                // title={`Monthly Revenue and Net Profit:[${revenueAndProfitYear}]`}
                // subheader="(+43%) than last year"
                chartLabels={revenueAndProfit.map((item) => `${item._id.split('/')[0]}/01/${item._id.split('/')[1]}`)}
                chartData={[
                  {
                    name: 'Revenue',
                    type: 'column',
                    fill: 'gradient',
                    data: revenueAndProfit.map((item) => item.revenue),
                  },
                  {
                    name: 'cost',
                    type: 'column',
                    fill: 'solid',
                    data: revenueAndProfit.map((item) => item.cost),
                    // data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 78],
                  },
                  {
                    name: 'Net Profit',
                    type: 'column',
                    fill: 'gradient',
                    data: revenueAndProfit.map((item) => item.netProfit),
                    // data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 87],
                  },
                ]}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Best-Selling Products via Credit Applications"
              chartData={topProducts.map((product) => ({
                label: product._id,
                value: product.totalSold,
              }))}
              subheader="(+43%) than last year"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Best-Selling Brands via Credit Applications    "
              chartData={topBrands.map((brand) => ({
                label: brand.title?brand.title:"",
                value: brand.count,
              }))}
              subheader="(+43%) than last year"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Best-Selling Categories via Credit Applications"
              chartData={topCategories.map((category) => ({
                label: category.title,
                value: category.count,
              }))}
              subheader="(+43%) than last year"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Top-performing Employees "
              chartData={topEmployees.map((employee) => ({
                label: employee.firstname + '' + employee.lastname,
                value: employee.count,
              }))}
              subheader="(+43%) than last year"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
