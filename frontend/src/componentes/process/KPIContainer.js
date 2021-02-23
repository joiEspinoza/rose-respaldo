import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import KPI, { KPI2 } from '../KPI';
import Boton from '../Boton';
import { DescargaExcelCandidatos } from '../downloads/DescargaExcel';
import { useTheme } from '@material-ui/core/styles';
import { Icon } from '@fluentui/react/lib/Icon';

const Container = ({ forma, itemes, columnas, data, nombre, fecha, user, processId }) => {
  const theme = useTheme();
  const getIcon = (iconName) => (
    <Icon
      style={{ transform: 'scale(3)', color: "white" }}
      iconName={iconName}
    ></Icon>
  )

  const downloadReport = () => {
    const url = `https://rosev0-dev-api.myfuture.ai/selection/create_excel/candidate/${processId}/${user.correo}`
    window.open(url, '_blank')
  }
  
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
              <KPI2 nombre={item.nombre} cantidad={item.cantidad} icon={item.icon}/>
            </Grid>
          ))}
          <Grid
              item
              xs={forma.xs}
              sm={forma.sm}
          >
            <div onClick={downloadReport} style={{cursor: "pointer"}}>
              <KPI nombre={"Exportar Excel"} cantidad={"Listado"}  icon={getIcon("ExcelDocument")} />
            </div>
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