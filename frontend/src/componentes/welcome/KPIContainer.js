import React from 'react';
import { Grid } from '@material-ui/core';
import KPI from '../KPI';



const Container = ({ forma, itemes }) => {

  return ( 
    <Grid
      container
      spacing={forma.spacing}
    >
      {itemes.map((item, key)=>(
        <Grid
          key={key}
          item
          xs={forma.xs}
          sm={forma.sm}
        >
          <KPI nombre={item.nombre} cantidad={item.cantidad} icon={item.icon}/>
        </Grid>
      ))}
      
    </Grid>
  );
}

export default Container;