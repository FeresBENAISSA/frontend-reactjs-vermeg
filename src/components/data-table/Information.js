import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { useState } from 'react';
import Card from '../../theme/overrides/Card';
import Typography from '../../theme/overrides/Typography';
import { Grid } from '@mui/material';
import { BASE_URL } from '../../Constants';
const Information = ({ row }) => {
  function handleButtonClick(file) {
    // window.open('http://localhost:5001/1d40ea08-c62b-4e5b-bedd-7c2b76535e09-Contract-France.pdf', '_blank', 'noopener noreferrer');
    window.open(`${BASE_URL}${file.split('/').pop()}`, '_blank', 'noopener noreferrer');
  }

  return (
    <>
      {' '}
      <Grid container spacing={0}>
        <Grid xs={6}>
          <h1>Client Information</h1>
          <h5>Firstname: {row.client.firstname ? row.client.firstname : ''}</h5>
          <h5>lastname:{row.client.lastname ? row.client.lastname : ''}</h5>
          <h5>address:{row.client.address ? row.client.address : ''}</h5>
          <h5>dateOfBirth:{row.client.dateOfBirth ? row.client.dateOfBirth : ''}</h5>
          <h5>identity:{row.client.identity ? row.client.identity : ''}</h5>
          <h5>rib:{row.client.rib ? row.client.rib : ''}</h5>
          <h5>sex:{row.client.sex ? row.client.sex : ''}</h5>
        </Grid>
        <Grid xs={6}>
          <h1>Simulatuon Information</h1>
          <h5>credit ammount: {row.simulation.creditAmount ? row.simulation.creditAmount : ''}</h5>
          <h5>
            credit ammount with tva :{row.simulation.creditAmountWithTVA ? row.simulation.creditAmountWithTVA : ''}
          </h5>
          <h5>deposit :{row.simulation.deposit ? row.simulation.deposit : ''}</h5>
          <h5>instalement :{row.simulation.instalment ? row.simulation.instalment : ''}</h5>

          <h5>identity:{row.simulation.instalmentAmount ? row.simulation.instalmentAmount : ''}</h5>
        </Grid>
        {row.contract ? (
          <Grid xs={12}>
            {row.contract.file ? (
              <div>
                <h1>Contract link</h1>
                <button onClick={() => handleButtonClick(row.contract.file)}>Open PDF</button>
              </div>
            ) : null}
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default Information;
