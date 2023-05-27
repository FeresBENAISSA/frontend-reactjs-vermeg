import { Helmet } from 'react-helmet-async';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Card, CardHeader } from '@mui/material';
// sections
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppConversionRates,
} from '../../sections/@dashboard/app';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';
import useAxios from '../../api/axios';
import { STATS_URL } from '../../Constants';
import { useEffect } from 'react';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function BankDashboardAppPage() {
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 0)); // This will be the first day of the current week
  const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // This will be the last day of the current week
  const theme = useTheme();
  const api = useAxios();
  const user = useSelector(selectCurrentUser);
  const welcome = user.firstname ? `welcome ${user.firstname} ${user.lastname}` : ' Hi, Welcome back';

  const [bankStats, setBankStats] = useState({});
  const [creditBySex, setCreditBySex] = useState([]);
  const [creditByAgeRange, setCreditByAgeRange] = useState([]);
  const [creditCountPerWeek, setCreditCountPerWeek] = useState([]);

  const getBankStatsCount = async () => {
    const response = await api.get(`${STATS_URL}/bank`);
    setBankStats(response.data);
    // console.log(response.data);
  };

  const creditCountBySex = async () => {
    const response = await api.get(`${STATS_URL}/credit-count-by-sex`);
    setCreditBySex(response.data);
  };
  const creditCountByAgeRange = async () => {
    const response = await api.get(`${STATS_URL}/credit-count-by-age-range`);
    setCreditByAgeRange(response.data);
  };
  const getCreditCountPerWeek = async () => {
    const response = await api.get(`${STATS_URL}/credit-count-per-week`);
    setCreditCountPerWeek(response.data);
  };
  useEffect(() => {
    getBankStatsCount();
    creditCountBySex();
    creditCountByAgeRange();
    getCreditCountPerWeek();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard Bank Agent </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {welcome}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Waiting for validation"
              total={bankStats.waititngForValidationCount}
              icon={'streamline:interface-page-controller-loading-half-progress-loading-load-half-wait-waiting'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Waiting for Signature"
              total={bankStats.waititngForSignatureCount}
              color="warning"
              icon={'mdi:sign'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Signed"
              total={bankStats.signedCount}
              color="success"
              icon={'carbon:document-signed'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Rejected"
              total={bankStats.rejectedCount}
              color="error"
              icon={'ic:baseline-remove-circle'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Distribution of Credit Applications by Gender"
              subheader="(+43%) than last year"
              chartData={creditBySex.map((item) => ({
                label: item.sex,
                value: item.count,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <AppConversionRates
              title="Distribution of Credit Applications by Age Range"
              subheader="(+43%) than last year"
              chartData={creditByAgeRange.map((item) => ({
                label: item.ageRange,
                value: item.count,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardHeader
                title={`Weekly Credit Application Count from ${firstDayOfWeek
                  .toISOString()
                  .slice(0, 10)} to ${lastDayOfWeek.toISOString().slice(0, 10)}`}
              />
              <AppWebsiteVisits
                // title={`Weekly Credit Application Count from ${firstDayOfWeek
                //   .toISOString()
                //   .slice(0, 10)} to ${lastDayOfWeek.toISOString().slice(0, 10)}`}
                subheader="(+43%) than last year"
                chartLabels={creditCountPerWeek.map((credit) => {
                  const date = new Date(credit.day);
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
                    type: 'line',
                    fill: 'solid',
                    data: creditCountPerWeek.map((credit) => {
                      return credit.count;
                    }),
                  },
                  {
                    name: 'Approuved Credit Appllication count',
                    type: 'area',
                    fill: 'gradient',
                    data: creditCountPerWeek.map((credit) => {
                      return credit.signedCount;
                    }),
                  },
                ]}
              />
            </Card>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
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

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
