import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const Test = () => {

  return(
    <Box sx={{ flexGrow: 1 }}>
     <Grid container spacing={{ xs: 2, md: 4}} columns={{ xs: 4, sm: 8, md: 12 }}>

         <Grid item xs={4} sm={4} md={4} >
           <Item>xs=2</Item>
         </Grid>
         <Grid item xs={12} sm={12} md={12} >
           <Item>xs=2</Item>
         </Grid>
         <Grid item xs={4} sm={4} md={4} >
           <Item>xs=2</Item>
         </Grid>

         <Grid item xs={4} sm={4} md={4} >
           <Item>xs=2</Item>
         </Grid>
         <Grid item xs={4} sm={4} md={4} >
           <Item>xs=2</Item>
         </Grid>
         <Grid item xs={4} sm={4} md={4} >
           <Item>xs=2</Item>
         </Grid>


     </Grid>
   </Box>
  );
}

export default Test;
