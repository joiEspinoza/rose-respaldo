import React, { useState } from 'react';
import { connect } from 'react-redux';
import Contenedor from '../contenedor';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import KPI from '../componentes/KPI';
import Bienvenida from '../componentes/welcome/Bienvenida';
import Procesos from '../componentes/Procesos';
import Tabla from '../componentes/table/Procesos';
import Boton from '../componentes/Boton';
import { DescargaExcelProcesos } from '../componentes/downloads/DescargaExcel';


const example = {
    "name": "",
    "description": "",
    "area": "",
    "subarea": "",
    "industry": "",
    "is_remote": false,
    "status": "",
    "vacant": null,
    "requirements": null,
    "desired": null,
    "kpis": null,
    "storage_url": "",
    "user": null
};


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
const Dashboard = (props) => {
  const classes = useStyles();
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:true, href:"/ViewProcess"},
    "createdAt":{titulo:"Creado",color:"textPrimary",tamano:"body2",link:false, },
    "status":{titulo:"Status",color:"textPrimary",tamano:"body2",link:false, },
    "below":{titulo:"Below",color:"textPrimary",tamano:"caption",link:false, },
    "normal":{titulo:"Normal",color:"textPrimary",tamano:"caption",link:false, },
    "outstanding":{titulo:"Outstanding",color:"textPrimary",tamano:"caption",link:false, }
  };
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const procesosSeleccionados = idSeleccionados.length === 0 ? [] : props.procesos.filter((i,index)=>idSeleccionados.map(i=>i-1).includes(index)).map(i=>({nombre:i.nombre,createdAt:i.createdAt,status:i.status,below:i.below,normal:i.normal,outstanding:i.outstanding}));
  return (
    
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            
            xs={6}
            md={6}
            sm={4}
            lg={3}
          >
            <Boton nombre={"Nuevo Proceso"} href={"/AddProcess"}/>
          </Grid>
          <Grid item onClick={()=>console.log(procesosSeleccionados)}>Hola</Grid>
          <Grid
            item
            xs={6}
            md={6}
            sm={4}
            lg={3}
          >
            {idSeleccionados.length === 0 ? 
              <Boton nombre={"Exportar Excel"} href={"#"}/>
            :
              <DescargaExcelProcesos
                boton={<Boton nombre={"Exportar Excel"} href={"#"}/>}
                columnas={columnasExcel}
                data={procesosSeleccionados}

              />
            }
              
            
          </Grid>
          
          <Grid
            item
            xs={12}
          >
          {props.procesos !== undefined &&
            <Tabla  data={props.procesos} columnas={columnas} idSeleccionados={idSeleccionados} definirIdSeleccionados={definirIdSeleccionados} seleccionarProceso={seleccionarProceso}/>
          }
          </Grid>
          
        </Grid>
  );
};

const Process = (props) => {
  
  return (
    <Contenedor>
      <Dashboard procesosExportarExcel={props.procesosExportarExcel} procesos_exportar_excel={props.procesos_exportar_excel}
      procesos={props.procesos} />
    </Contenedor>
  );
}
const seleccionarProceso = (newIndex) => {
  return {
    type: 'SELECCIONAR_PROCESO',
    newIndex: newIndex,
  }
}

const procesosExportarExcel = (newState) => {
  return {
    type: 'DEFINIR_PROCESOS_EXPORTAR_EXCEL',
    newIndex: newState,
  }
}

const mapStateToProps = estado => {
  return {
    procesos: estado.procesos,
    procesos_exportar_excel: estado.procesos_exportar_excel,
  }
}

const mapDispatchToProps = despachar => {
    return {
        procesosExportarExcel: (newState) => despachar(procesosExportarExcel(newState)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);