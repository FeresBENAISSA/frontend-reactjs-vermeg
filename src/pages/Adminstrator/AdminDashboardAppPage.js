import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, InputLabel, FormControl, Button, Box, CardHeader } from '@mui/material';
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
import useAxios from '../../api/axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { STATS_URL } from '../../Constants';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ----------------------------------------------------------------------

export default function AdminDashboardAppPage() {
  const theme = useTheme();
  const user = useSelector(selectCurrentUser);
  const welcome = user.firstname ? `welcome ${user.firstname} ${user.lastname}` : ' Hi, Welcome back';
  const api = useAxios();
  const current = new Date().getFullYear();
  const [revenueAndProfitYear, setRevenueAndProfitYear] = useState(`${current}`);
  const [creditCounYear, setCreditCounYear] = useState(`${current}`);
  const [adminStats, setAdminStats] = useState({});
  const [topStores, setTopStores] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [creditCountPerMonth, setCreditCountPerMonth] = useState([]);
  const [revenueAndProfit, setRevenueAndProfit] = useState([]);
  const [statusCount, setStatusCount] = useState({});
  const getAdminStatsCount = async () => {
    const response = await api(`${STATS_URL}/admin`);
    setAdminStats(response.data);
    // console.log(response);
  };
  const getTopStores = async () => {
    const response = await api(`${STATS_URL}/top-stores`);
    setTopStores(response.data);
    // console.log(response);
  };
  const getCreditGroupedByState = async () => {
    const response = await api(`${STATS_URL}/state-count`);
    if (response.data[0]) setStatusCount(response.data[0]);
    // console.log(response.data[0]);
  };

  const getTopCompanies = async () => {
    const response = await api(`${STATS_URL}/top-companies`);
    setTopCompanies(response.data);
    // console.log(response);
  };
  const handleChangeYearForCreditCount = async (values) => {
    setCreditCountPerMonth([]);
    const object = {
      date: values.$d,
    };
    const response = await api.post(`${STATS_URL}/credit-count-per-month`, object);
    setCreditCountPerMonth(response.data);
  };

  const handleChangeYearForRevenueAndProfit = async (values) => {
    setRevenueAndProfit([]);
    const object = {
      date: values.$d,
    };
    const response = await api.post(`${STATS_URL}/revenue-and-profit`, object);
    setRevenueAndProfit(response.data);
    // console.log(response.data);
  };

  useEffect(() => {
    getCreditGroupedByState();
    getAdminStatsCount();
    getTopStores();
    getTopCompanies();
    handleChangeYearForCreditCount({ date: new Date() });
    handleChangeYearForRevenueAndProfit({ date: new Date() });
  }, []);

  function disabledDate(current) {
    // Disable all years before 2023
    return current.year() < 2021; // disabling everything in the past before 2021
  }

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
            <AppWidgetSummary title="Total companies" total={adminStats.companiesCount} icon={'mdi:company'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total stores"
              total={adminStats.storesCount}
              color="info"
              icon={'streamline:shopping-store-1-store-shop-shops-stores'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total clients"
              total={adminStats.clientsCount}
              color="warning"
              icon={'mdi:users-group'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Total credit applications"
              total={adminStats.creditAppsCount}
              color="error"
              icon={'mdi:form-outline'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title={`Top ${topStores.length} Stores by Credit Application Count `}
              subheader="(+43%) than last year"
              chartData={topStores.map((store) => ({
                label: `${store.store.storeLabel}`,
                value: store.count,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title={`Top ${topCompanies.length} Companies by Credit Application Count `}
              subheader="(+43%) than last year"
              chartData={topCompanies.map((company) => ({
                label: company.companyLabel,
                value: company.count,
              }))}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ p: 3, mb: 1 }}>
              <CardHeader
                title={`Monthly Credit Application Count: [${creditCounYear}]`}
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="pick a year"
                        disableDate={disabledDate}
                        views={['year']}
                        onChange={(newValue) => {
                          setCreditCounYear(newValue.$y);
                          handleChangeYearForCreditCount(newValue);
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                }
              />
              <AppWebsiteVisits
                title={`Monthly Credit Application Count: [${creditCounYear}]`}
                subheader="(+43%) than last year"
                chartLabels={creditCountPerMonth.map((credit) => {
                  const date = new Date(credit.month);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                  });
                  return formattedDate;
                })}
                chartData={[
                  {
                    name: 'Credit Appllication count',
                    type: 'area',
                    fill: 'gradient',
                    data: creditCountPerMonth.map((credit) => {
                      return credit.count;
                    }),
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
                  disableDate={disabledDate}
                  views={['year']}
                  onChange={(newValue) => {
                    setCreditCounYear(newValue.$y);
                    handleChangeYearForCreditCount(newValue);
                  }}
                />
              </LocalizationProvider>
            </Card>
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ p: 3, mb: 1 }}>
              <CardHeader
                title={`Monthly Credit Application Count: [${creditCounYear}]`}
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="pick a year"
                        disableDate={disabledDate}
                        views={['year']}
                        onChange={(newValue) => {
                          setRevenueAndProfitYear(newValue.$y);
                          handleChangeYearForRevenueAndProfit(newValue);
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                }
              />
              <AppWebsiteVisits
                title={`Monthly Revenue and Net Profit:[${revenueAndProfitYear}]`}
                subheader="(+43%) than last year"
                chartLabels={revenueAndProfit.map((item) => `${item._id.split('/')[0]}/01/${item._id.split('/')[1]}`)}
                chartData={[
                  {
                    name: 'Revenue',
                    type: 'column',
                    fill: 'solid',
                    data: revenueAndProfit.map((item) => item.revenue),
                  },
                  {
                    name: 'cost',
                    type: 'column',
                    fill: 'solid',
                    data: revenueAndProfit.map((item) => item.cost),
                  },
                  {
                    name: 'Net Profit',
                    type: 'column',
                    fill: 'gradient',
                    data: revenueAndProfit.map((item) => item.netProfit),
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
                  disableDate={disabledDate}
                  views={['year']}
                  onChange={(newValue) => {
                    setRevenueAndProfitYear(newValue.$y);
                    handleChangeYearForRevenueAndProfit(newValue);
                  }}
                />
              </LocalizationProvider>
            </Card>
          </Grid> */}
          {/* <Grid item xs={12} md={6} lg={4}>
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
          </Grid> */}
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Credit Application Percentage by State"
              chartData={[
                { label: 'Simulation', value: statusCount.SIMULATION ? statusCount.SIMULATION : 0 },
                { label: 'Being created', value: statusCount.BEING_CREATED ? statusCount.BEING_CREATED : 0 },
                { label: 'Submit credit', value: statusCount.SUBMIT_CREDIT ? statusCount.SUBMIT_CREDIT : 0 },
                {
                  label: 'Waiting For Validation',
                  value: statusCount.WAITING_FOR_VALIDATION ? statusCount.WAITING_FOR_VALIDATION : 0,
                },
                {
                  label: 'Waiting For Signature',
                  value: statusCount.WAITING_FOR_SIGNATURE ? statusCount.WAITING_FOR_SIGNATURE : 0,
                },
                { label: 'Signed', value: statusCount.SIGNED ? statusCount.SIGNED : 0 },
                { label: 'Rejected', value: statusCount.REJECTED ? statusCount.REJECTED : 0 },
              ]}
              chartColors={[
                theme.palette.warning.light,
                theme.palette.warning.main,
                theme.palette.warning.dark,
                theme.palette.success.light,
                theme.palette.success.main,
                theme.palette.success.dark,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
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
