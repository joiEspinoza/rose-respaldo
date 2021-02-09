import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { KPI2 as KPI } from '../KPI';
import Boton from '../Boton';
import { DescargaExcelCandidatos } from '../downloads/DescargaExcel';
import { useTheme } from '@material-ui/core/styles';


const Container = ({ forma, itemes, columnas, data, nombre, fecha }) => {
  const theme = useTheme();
  return ( 
    <Grid
      container
      spacing={0}
    >
      <Grid item xs={12}>
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
          <Grid
              item
              xs={forma.xs}
              sm={forma.sm}
            >
            <DescargaExcelCandidatos
              boton={<Boton nombre={"Exportar Excel"} href={"#"} color={"secondary"} desactivado={false} icon={"ExcelDocument"}/>}
              columnas={columnas} data={data}

            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3" style={{ color:theme.palette.grisoscuro, marginTop: "1rem" }}>
          {nombre}
        </Typography>
        <Typography variant="body1" style={{ color:theme.palette.grisoscuro }}>
          {fecha.slice(0,10)}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Container;