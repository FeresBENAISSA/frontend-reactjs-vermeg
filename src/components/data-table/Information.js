import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { useState } from 'react';
import Card from '../../theme/overrides/Card';
import Typography from '../../theme/overrides/Typography';
import { Grid } from '@mui/material';
const Information = ({ row }) => {

  return (
    <>
      {' '}
      <Grid container spacing={0}>
        <Grid xs={6}>
      
          <h1>Client Information</h1>
          <h5>Firstname: {row.client.firstname}</h5>
          <h5>lastname:{row.client.lastname}</h5>
          <h5>address:{row.client.address}</h5>
          <h5>dateOfBirth:{row.client.dateOfBirth}</h5>
          <h5>identity:{row.client.identity}</h5>
          <h5>rib:{row.client.rib}</h5>
          <h5>sex:{row.client.sex}</h5>
        </Grid>
        <Grid xs={6}>
          <h1>Simulatuon Information</h1>
          <h5>Firstname: {row.simulation.creditAmount?row.simulation.creditAmount:""}</h5>
          <h5>lastname:{row.simulation.creditAmountWithTVA?row.simulation.creditAmountWithTVA:""}</h5>
          <h5>address:{row.simulation.deposit?row.simulation.deposit:""}</h5>
          <h5>dateOfBirth:{row.simulation.instalment?row.simulation.instalment:""}</h5>
          
          <h5>identity:{row.simulation.instalmentAmount?row.simulation.instalmentAmount:""}</h5>
        </Grid>
      </Grid>
    </>
  );
};

export default Information;
