import React, { useState } from 'react';
import { connect } from 'react-redux';
import Contenedor from '../contenedor';
import {
  Grid,
} from '@material-ui/core';
import Tabla from '../componentes/table/Procesos';
import Boton from '../componentes/Boton';
import { NATabla, NATarjeta } from '../componentes/NA';
import { DescargaExcelProcesos } from '../componentes/downloads/DescargaExcel';


const Dashboard = (props) => {
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "name":{titulo:"Nombre",color:"primary",tamano:"h6",link:true, href:"/ViewProcess"},
    "created_at":{titulo:"Creado",color:"textPrimary",tamano:"body2",link:false, },
    "status":{titulo:"Status",color:"textHint",tamano:"subtitle2",link:false, },
    "below":{titulo:"Below",color:"textPrimary",tamano:"caption",link:false, },
    "normal":{titulo:"Normal",color:"textPrimary",tamano:"caption",link:false, },
    "outstanding":{titulo:"Outstanding",color:"textPrimary",tamano:"caption",link:false, },
    "edit":{titulo:"Editar",color:"secondary",tamano:"h6",link:true, href:"/EditProcess"},
  };
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const procesosSeleccionados = idSeleccionados.length === 0 ? [] : props.procesos.filter((i,index)=>idSeleccionados.includes(i.id)).map(i=>({name:i.name,created_at:i.created_at,status:i.status,below:i.kpis.below,normal:i.kpis.normal,outstanding:i.kpis.outstanding}));
  console.log(idSeleccionados);
  return (
    
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
          >
          {props.procesos === null ?
            <>
              <NATarjeta extendida={false} mensaje={"Sin registros, no disponible"} sizes={{mensaje:"h6"}}>
                <NATabla  columnas={columnas} />
              </NATarjeta>
            </>
          :
            <Tabla filtros={props.filtros} anadirFiltro={props.anadirFiltro} data={props.procesos} columnas={columnas} idSeleccionados={idSeleccionados} definirIdSeleccionados={definirIdSeleccionados} seleccionarProceso={seleccionarProceso}/>
          }
          </Grid>

          <Grid
            item
            
            xs={6}
            md={6}
            sm={4}
            lg={3}
          ></Grid>
          <Grid
            item
            
            xs={6}
            md={6}
            sm={4}
            lg={3}
          >
            <Boton nombre={"Nuevo Proceso"} href={"/AddProcess"} color={"secondary"} icon={"CircleAddition"}/>
          </Grid>
          <Grid
            item
            xs={6}
            md={6}
            sm={4}
            lg={3}
          >
            <DescargaExcelProcesos
              boton={
                <Boton 
                  desactivado={props.procesos === null && idSeleccionados.length === 0} 
                  nombre={"Exportar Excel"} 
                  href={"#"} 
                  color={"secondary"} 
                  icon={"ExcelDocument"}
                />
              }
              columnas={columnasExcel}
              data={procesosSeleccionados}

            />
              
            
          </Grid>
          
        </Grid>
  );
};

const Process = (props) => {
  
  return (
    <Contenedor>
      <Dashboard procesosExportarExcel={props.procesosExportarExcel} procesos_exportar_excel={props.procesos_exportar_excel}
      procesos={props.procesos} filtros={props.filtros} anadirFiltro={props.anadirFiltro}/>
    </Contenedor>
  );
}
const seleccionarProceso = (newIndex) => {
  return {
    type: 'SELECCIONAR_PROCESO',
    newIndex: newIndex,
  }
}
const anadirFiltro = (nuevoFiltro) => {
  return {
    type: 'ANADIR_FILTRO',
    nuevoFiltro: nuevoFiltro,
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
    filtros: estado.filtrosprocesos,
  }
}

const mapDispatchToProps = despachar => {
    return {
        procesosExportarExcel: (newState) => despachar(procesosExportarExcel(newState)),
        anadirFiltro: (nuevoFiltro) => despachar(anadirFiltro(nuevoFiltro)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);