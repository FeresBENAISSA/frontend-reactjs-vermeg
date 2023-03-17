import { Card, CardContent, CardHeader, Grid, TextField, Box, Divider, CardActions, Button } from '@mui/material';
import { useCallback, useState } from 'react';
// import Card from "../../../theme/overrides/Card";

export const AccountProfileDetails = (props) => {
  const { user } = props;

  const states = [
    {
      value: 'alabama',
      label: 'Alabama',
    },
    {
      value: 'new-york',
      label: 'New York',
    },
    {
      value: 'san-francisco',
      label: 'San Francisco',
    },
    {
      value: 'los-angeles',
      label: 'Los Angeles',
    },
  ];
  const [values, setValues] = useState({
    firstName: user.firstname,
    lastName: user.lastname,
    email: '',
    phone: '',
    state: '',
    country: '',
  });

  const handleChange = useCallback((event) => {
    setValues((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    console.log(event);
  }, []);

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card sx={{ ml: 3 }}>
        <CardHeader subheader="The information can be edited" title="Profile" sx={{ mb: 5 }} />
        <CardContent sx={{ pt: 0, ml: 4 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  onChange={handleChange}
                  required
                  value={values.country}
                />
              </Grid>
              <Grid xs={12} md={6} sx={{ mb: 2, pr: 1 }}>
                <TextField
                  fullWidth
                  // label="Select State"
                  name="state"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.state}
                >
                  {states.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
