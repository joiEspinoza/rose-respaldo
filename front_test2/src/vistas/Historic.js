import React, { useState } from 'react';
import Contenedor from '../contenedor';
import KPI from '../componentes/KPI';
import Boton from '../componentes/Boton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Grid } from '@material-ui/core';
import { DescargaExcelHistorico } from '../componentes/downloads/DescargaExcel';
import Tabla from '../componentes/table/Historico';

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
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    "profesion":{titulo:"Profesion",color:"textPrimary",tamano:"body2",link:false, },
    "universidad":{titulo:"Universidad",color:"textPrimary",tamano:"body2",link:false, },
    "email":{titulo:"Email",color:"textPrimary",tamano:"caption",link:false, },
    "ciudad":{titulo:"Ciudad",color:"textPrimary",tamano:"caption",link:false, },
  };
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const candidatosSeleccionados = idSeleccionados.length === 0 ? [] : historicData.filter((i,index)=>idSeleccionados.map(i=>i-1).includes(index)).map(i=>({nombre:i.nombre,profesion:i.profesion,universidad:i.universidad,email:i.email,ciudad:i.ciudad}));
  return (
    <Contenedor>
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
          	<KPI nombre={"Candidatos en Rose"} cantidad={7} icon={<AccessTimeIcon/>}/>
          </Grid>
          <Grid item onClick={()=>console.log(candidatosSeleccionados)}>Hola</Grid>
          <Grid
            item
            xs={6}
            md={6}
            sm={4}
            lg={3}
          >
            <DescargaExcelHistorico
                boton={<Boton nombre={"Exportar Excel"} href={"#"}/>}
                columnas={columnasExcel}
                data={candidatosSeleccionados}

              />
            
          </Grid>
          <Grid
            item
            xs={12}
          >
          
            <Tabla  data={historicData} columnas={columnas} idSeleccionados={idSeleccionados} definirIdSeleccionados={definirIdSeleccionados}/>
          </Grid>
          
        </Grid>
    </Contenedor>
  );
}

export default Historic;