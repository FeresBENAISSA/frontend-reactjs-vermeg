import { useEffect } from 'react';
import useAxios from '../../api/axios';
import { useState } from 'react';
import Card from '../../theme/overrides/Card';
import { Container, Grid, List, ListItem, ListItemText, Paper, makeStyles, Typography, Button } from '@mui/material';
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
        <Grid item xs={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div" align="center">
            Client Information
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="Firstname" secondary={row?.client?.firstname ? row?.client?.firstname : 'Marie'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Lastname" secondary={row?.client?.lastname ? row?.client?.lastname : 'Marie'} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Address"
                secondary={row?.client?.address ? row?.client?.address : '05 Rue abou zakariya el hafsi'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="documentNumber"
                secondary={row?.client?.documentNumber ? row?.client?.documentNumber : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="DateOfBirth" secondary={row?.client?.dateOfBirth ? row?.client?.dateOfBirth : ''} />
            </ListItem>
            <ListItem>
              <ListItemText primary="placeOfBirth" secondary={row?.client?.placeOfBirth ? row?.client?.placeOfBirth : ''} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Identity" secondary={row?.client?.identity ? row?.client?.identity : ''} />
            </ListItem>
            <ListItem>
              <ListItemText primary="email" secondary={row?.client?.email ? row?.client?.email : ''} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Iban" secondary={row?.client?.IBAN ? row?.client?.IBAN : ''} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h5" component="div" align="center">
        Simulatuon Information
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="creditAmount" secondary={row?.simulation?.creditAmount ? row?.simulation?.creditAmount : 'Marie'} />
            </ListItem>
            <ListItem>
              <ListItemText primary="deposit" secondary={row.simulation.deposit ? row.simulation.deposit : ''} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="installment"
                secondary={row.simulation.installment ? row.simulation.installment : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="installmentAmount"
                secondary={row.simulation.installmentAmount ? row.simulation.installmentAmount : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="children"
                secondary={row.simulation.questions.children ? row.simulation.questions.children : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="homeOwnership"
                secondary={row.simulation.questions.homeOwnership ? row.simulation.questions.homeOwnership : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="martial"
                secondary={row.simulation.questions.martial ? row.simulation.questions.martial : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="martial"
                secondary={row.simulation.questions.employement ? row.simulation.questions.employement : ''}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="total" secondary={row.simulation.total ? row.simulation.total : ''} />
            </ListItem>
          </List>
        </Grid>
        {row.contract ? (
          <Grid  item xs={12}>
            {row.contract.file ? (

                <Button onClick={() => handleButtonClick(row.contract.file)} fullWidth variant="outlined">Open Contract pdf</Button>
           
            
            ) : null}
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

export default Information;
