import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom'
import Contenedor from '../contenedor';
import {
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Icon } from '@fluentui/react/lib/Icon';
import Tabla from '../componentes/table/Procesos';
import Boton from '../componentes/Boton';
import { NATabla, NATarjeta } from '../componentes/NA';
import { DescargaExcelProcesos } from '../componentes/downloads/DescargaExcel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderRadius: theme.spacing(4),
  },
  
}));

const Dashboard = (props) => {
  const history = useHistory();
  const classes = useStyles();
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "name": { titulo: "Nombre", color: "primary", tamano: "h6", link: true, href: "/ViewProcess" },
    "created_at": { titulo: "Creado", color: "textPrimary", tamano: "body2", link: false, },
    "status": { titulo: "Status", color: "textHint", tamano: "subtitle2", link: false, },
    "low": { titulo: "Below", color: "textPrimary", tamano: "caption", link: false, },
    "medium": { titulo: "Normal", color: "textPrimary", tamano: "caption", link: false, },
    "high": { titulo: "Outstanding", color: "textPrimary", tamano: "caption", link: false, },
    "edit": { titulo: "Editar", color: "secondary", tamano: "h6", link: true, href: "/EditProcess" },
  };
  const columnasExcel = Object.keys(columnas).map(col => ({ label: columnas[col].titulo, value: col }));
  const procesosSeleccionados = idSeleccionados.length === 0
    ? []
    : props.procesos.filter((process, index) => (
      idSeleccionados.includes(process.id)).map(item => ({
        name: item.name,
        created_at: item.created_at,
        status: item.status,
        low: item.kpis.low,
        medium: item.kpis.medium,
        high: item.kpis.high
      }))
    )
  

  const [filtrados, definirFiltrados] = useState([]);
  const Filtrar = (filtros, data) => {
    var salida = data;
    var aux = [];
    for (let filtro of filtros) {
      var indice = 0;
      for (let elemento of data) {
        if(elemento[filtro.variable].includes(filtro.valor)){
          aux.push(indice);
        }
        indice = indice + 1;
      }
      salida = salida.filter((i,index)=>aux.includes(index));
      aux = [];
    }
    console.log(salida);
    definirIdSeleccionados([]);
    return salida;
  }
  useEffect(()=>{
    const f = Filtrar(props.filtros,props.procesos);
    definirFiltrados(f);
  }, [props.filtros]);

  const createNewProcess = () => {
    const { threshold } = props.config || {}
    if (props.procesos.length >= parseInt(threshold, 10)) {
      alert(`Se acabaron tus procesos de selección (${threshold}), escribe a rose@myfuture.ai para adquirir más!`)
      return
    }

    history.push('/AddProcess')
  }
  
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
            <Tabla filtros={props.filtros} anadirFiltro={props.anadirFiltro} eliminarFiltro={props.eliminarFiltro} data={filtrados} columnas={columnas} idSeleccionados={idSeleccionados} definirIdSeleccionados={definirIdSeleccionados} seleccionarProceso={seleccionarProceso}/>
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
            <Button
              variant="contained"
              color={"secondary"}
              className={classes.root}
              onClick={createNewProcess}
              endIcon={
                <Icon
                  style={{ transform: 'scale(1.5)' }} 
                  iconName={"CircleAddition"} />
              }>
              {"Nuevo Proceso"} 
            </Button>
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
      <Dashboard
        procesosExportarExcel={props.procesosExportarExcel}
        procesos_exportar_excel={props.procesos_exportar_excel}
        procesos={props.procesos}
        filtros={props.filtros}
        anadirFiltro={props.anadirFiltro}
        eliminarFiltro={props.eliminarFiltro}
        config={props.config}
      />
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

const eliminarFiltro = (index) => {
  return {
    type: 'ELIMINAR_FILTRO',
    indice: index,
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
    procesos: estado.procesos.map((i,index)=>(Object.assign({},i,{index:index}))),
    procesos_exportar_excel: estado.procesos_exportar_excel,
    filtros: estado.filtrosprocesos.map((i, index) => (Object.assign({}, i, { index: index }))),
    config: estado.configuracion,
  }
}

const mapDispatchToProps = despachar => {
    return {
        procesosExportarExcel: (newState) => despachar(procesosExportarExcel(newState)),
        anadirFiltro: (nuevoFiltro) => despachar(anadirFiltro(nuevoFiltro)),
        eliminarFiltro: (index) => despachar(eliminarFiltro(index)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Process);