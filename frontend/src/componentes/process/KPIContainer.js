import React from 'react';
import { Grid } from '@material-ui/core';
import KPI from '../KPI';
import Boton from '../Boton';
import { DescargaExcelCandidatos } from '../downloads/DescargaExcel';



const Container = ({ forma, itemes, columnas, data }) => {

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
      <Grid
          item
          xs={forma.xs}
          sm={forma.sm}
        >
        <DescargaExcelCandidatos
          boton={<Boton nombre={"Exportar Excel"} href={"#"}/>}
          columnas={columnas} data={data}

        />
      </Grid>
    </Grid>
  );
}

export default Container;