import React, { useState } from 'react';
import Contenedor from '../contenedor';
import { KPI2 as KPI } from '../componentes/KPI';
import Boton from '../componentes/Boton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Grid } from '@material-ui/core';
import { DescargaExcelHistorico } from '../componentes/downloads/DescargaExcel';
import Tabla from '../componentes/table/Historico';
import { NAHistoric } from '../componentes/NA';

import { Icon } from '@fluentui/react/lib/Icon';

import { DataGrid } from '@material-ui/data-grid';

const historicData = [
  {
    id: 1,
    ciudad: "Stgo, Chile",
    email: "bgonzalez@myfuture.ai",
    nombre: "Benjamín González",
    profesion: "Ing. Civil Industrial mención TI",
    universidad: "Universidad Adolfo Ibáñez",
  },
  {
    id: 2,
    ciudad: "Viña del mar, Chile",
    email: "catamuñoz@myfuture.ai",
    nombre: "Catalina Muñoz",
    profesion: "Ing. Civil Industrial mención TI",
    universidad: "Universidad Adolfo Ibáñez",
  },
  {
    id: 3,
    ciudad: "Stgo, Chile",
    email: "fermaldonado@myfuture.ai",
    nombre: "Fernanda Maldonado",
    profesion: "Ing. Civil Industrial mención TI",
    universidad: "Universidad Adolfo Ibáñez",
  },
];
const Historic = (props) => {
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    "profesion":{titulo:"Profesion",color:"textPrimary",tamano:"body2",link:false, },
    "universidad":{titulo:"Universidad",color:"textPrimary",tamano:"body2",link:false, },
    "email":{titulo:"Email",color:"textPrimary",tamano:"caption",link:false, },
    "ciudad":{titulo:"Ciudad",color:"textPrimary",tamano:"caption",link:false, },
  };
  return (
    <>
      {historicData===null ? 
        <Contenedor>
          <NAHistoric mensaje={"Sin registros, no disponible"} columnas={columnas}>
            <Boton nombre={"Exportar Excel"} desactivado={true} href={"#"} icon={"ExcelDocument"}/>
          </NAHistoric>
        </Contenedor>
      :
        <Contenido />
      }
    </>
  );
}


const Contenido = (props) => {
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    "profesion":{titulo:"Profesion",color:"textPrimary",tamano:"body2",link:false, },
    "universidad":{titulo:"Universidad",color:"textPrimary",tamano:"body2",link:false, },
    "email":{titulo:"Email",color:"textPrimary",tamano:"caption",link:false, },
    "ciudad":{titulo:"Ciudad",color:"textPrimary",tamano:"caption",link:false, },
  };
  var cont = document.getElementById("contenedor");
  console.log(cont);
  const colu = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'profesion', headerName: 'Profesion', flex: 1 },
    { field: 'universidad', headerName: 'Universidad', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'ciudad', headerName: 'Ciudad', flex: 1 },
  ];
  const columns = colu.map(i=>Object.assign({},i));
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const candidatosSeleccionados = idSeleccionados.length === 0 ? [] : historicData.filter((i,index)=>idSeleccionados.includes(index)).map(i=>({nombre:i.nombre,profesion:i.profesion,universidad:i.universidad,email:i.email,ciudad:i.ciudad}));
  
  const onSelectionChange = (e) => {
    definirIdSeleccionados(e.rowIds.map(i=>Number(i)-1));
  }

  return (
    <Contenedor>
    <div id="contenedor">
      <Grid
          container
          spacing={3}
          
        >
          <Grid
            item
            
            xs={5}
            md={4}
            sm={4}
            lg={3}
          >
          	<KPI nombre={"Cantidad de candidatos total"} cantidad={historicData.length} />
          </Grid>
          <Grid
            item
            
            xs={2}
            md={4}
            sm={4}
            lg={6}
          ></Grid>
          <Grid
            item
            xs={5}
            md={4}
            sm={4}
            lg={3}
          >
            <DescargaExcelHistorico
                boton={<Boton nombre={"Exportar Excel"} href={"#"} color={"secondary"} desactivado={idSeleccionados.length === 0} icon={"ExcelDocument"}/>}
                columnas={columnasExcel}
                data={candidatosSeleccionados}

              />
            
          </Grid>
          <Grid
            item
            xs={12}
            style={{height:"300px"}}
          >
            
              <DataGrid onSelectionChange={onSelectionChange}
              columns={columns} pageSize={5} autoHeight rows={historicData} checkboxSelection />
            
          </Grid>
          
          
        </Grid>
      </div>
    </Contenedor>
  );
}

export default Historic;