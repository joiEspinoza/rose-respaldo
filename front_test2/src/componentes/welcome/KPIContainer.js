import React from 'react';
import { Grid } from '@material-ui/core';
import KPI from '../KPI';
import Boton from '../Boton';



const Container = ({ forma, itemes }) => {

  return ( 
    <Grid
      container
      spacing={forma.spacing}
    >
      {itemes.map(item=>(
        <Grid
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