import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardHeader, Box, Switch, Stack } from '@mui/material';
// components
import Iconify from '../../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
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
    console.log(response.data)
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
    console.log(response)
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
    console.log(event.target.checked)
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
          {/* <Grid item xs={12} md={2} lg={2}>
            <Card sx={{ p: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="pick a year"
                  views={['year']}
                  onChange={(newValue) => {
                    setRevenueAndProfitYear(newValue.$y);
                    handleChangeYearForRevenueAndProfit(newValue);
                  }}
                />
              </LocalizationProvider>
            </Card>
          </Grid> */}

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

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
