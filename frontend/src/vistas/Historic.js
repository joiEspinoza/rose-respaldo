import React, { useState } from 'react';
import Contenedor from '../contenedor';
import { KPI3 as KPI } from '../componentes/KPI';
import Boton from '../componentes/Boton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Grid } from '@material-ui/core';
import { DescargaExcelHistorico } from '../componentes/downloads/DescargaExcel';
import Tabla from '../componentes/table/Historico';
import { NAHistoric } from '../componentes/NA';
import { TablaEstilo } from '../estilo/Estilo';
import { connect } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';

import { DataGrid } from '@material-ui/data-grid';

const d = {
  "data": [
    {
      "id": 1528,
      "created_at": "2020-12-30T15:02:49.358279-03:00",
      "updated_at": "2020-12-30T15:02:49.358362-03:00",
      "name": "DANIEL ENRIQUE FARIAS ARAVENA",
      "mail": "dan.fariasa@alumnos.duoc.cl",
      "info": {
        "data": {
          "exp": 7,
          "mail": [
            "dan.fariasa@alumnos.duoc.cl"
          ],
          "type": [
            "Técnico"
          ],
          "phone": [
            "+56933993898 - 232189552"
          ],
          "degree": [
            "analista programador computacional con conocimientos en desarrollo en java aplicándolo tanto en ide netbeans como",
            "tecnico de nivel medio en telecomunicaciones",
            "ing. en informatica",
            "analista programador computacional"
          ],
          "idioms": [
            "inglés ( intermedio )",
            "inglés medio ( intermedio )"
          ],
          "skills": [
            "wpf, windows form, metroframework, mvc.net, entity framework, linq,wcf services), motor de base de datos como oracle (pl/sql), mysql, sqlserver(transact-sql"
          ],
          "college": [
            "duoc uc"
          ],
          "location": [
            "La Pintana, La Pintana"
          ],
          "companies": [
            "SHIFT SPA",
            "DEIRA COMPUTACIÓN Y SERVICIOS"
          ],
          "graduation": [
            "2015",
            "2017"
          ],
          "designation": [
            "ayudante de proyectos",
            "analista  programador"
          ],
          "certficiations": []
        },
        "rank": 4.9
      },
      "selection": 66
    },
    {
      "id": 1529,
      "created_at": "2020-12-30T15:02:49.562702-03:00",
      "updated_at": "2020-12-30T15:02:49.562850-03:00",
      "name": "Desconocido",
      "mail": "fernandez.chl@gmail.com",
      "info": {
        "data": {
          "exp": 10,
          "mail": [
            "fernandez.chl@gmail.com"
          ],
          "type": [
            "-"
          ],
          "phone": [
            "+56966877041"
          ],
          "degree": [
            "ingeniría civil informática"
          ],
          "idioms": [
            "back-end developer, beetrack, santiago, chile.\n",
            "español nativo",
            "inglés",
            "intermedio (hablado y escrito"
          ],
          "skills": [
            "system administrator",
            "conocimientos informáticos",
            "ruby on rails, react, docker, capistrano, circleci, aws (s3, ec2, ecs, ecr, eb",
            "web",
            "sistemas linux, osx",
            "complementario"
          ],
          "college": [
            "universidad técnica federico santa maría"
          ],
          "location": [],
          "companies": [],
          "graduation": [],
          "designation": [
            "software developer"
          ],
          "certficiations": []
        },
        "rank": 6.5
      },
      "selection": 66
    },
    {
      "id": 1530,
      "created_at": "2020-12-30T15:02:49.768156-03:00",
      "updated_at": "2020-12-30T15:02:49.768248-03:00",
      "name": "Patricio Antonio Cabrera Vera",
      "mail": "​patriciocabreravera@gmail.com",
      "info": {
        "data": {
          "exp": 3,
          "mail": [
            "​patriciocabreravera@gmail.com"
          ],
          "type": [
            "-"
          ],
          "phone": [
            "+56 9 64755804"
          ],
          "degree": [],
          "idioms": [],
          "skills": [
            "windows,linux (preferentemente linux mint/ubuntu)",
            "jquery: manejo avanzado de jquery y vainilla js",
            "mysql. postgresql, sqlserver (2008), mongo db, amazon rds, mongo db, firebase real time",
            "graphql",
            "lenguajes de programación: python,c++,javascript,php,c#,ruby,typescript"
          ],
          "college": [],
          "location": [
            "Ignacio Carrera Pinto 4666 depto 2, Macul"
          ],
          "companies": [
            "Go Technology",
            "Sáltala",
            "Redcapital",
            "GIT"
          ],
          "graduation": [],
          "designation": [],
          "certficiations": []
        },
        "rank": 3.8
      },
      "selection": 66
    },
  ],
} 

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
        <Contenido configuracion={props.configuracion} user={props.user} />
      }
    </>
  );
}


const Contenido = ({ configuracion, user}) => {
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    "profesion":{titulo:"Profesion",color:"textPrimary",tamano:"body2",link:false, },
    "universidad":{titulo:"Universidad",color:"textPrimary",tamano:"body2",link:false, },
    "email":{titulo:"Email",color:"textPrimary",tamano:"caption",link:false, },
    "ciudad":{titulo:"Ciudad",color:"textPrimary",tamano:"caption",link:false, },
  };
  var cont = document.getElementById("contenedor");
  const icono = <Icon style={{
      transform: 'scale(3)',
      color:"white", // Tune it
  }} iconName={"PlannerLogo"} />;

  const getIcon = (iconName) => (
    <Icon
      style={{ transform: 'scale(3)', color: "white" }}
      iconName={iconName}
    ></Icon>
  )

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

  const downloadReport = () => {
    const url = `https://rosev0-dev-api.myfuture.ai/selection/create_excel/historic/0/${user.correo}`
    window.open(url, '_blank')
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
          	<KPI nombre={"Cantidad de candidatos total"} cantidad={historicData.length} icon={icono}/>
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
            <div onClick={downloadReport}>
              <KPI nombre={"Exportar Excel"} icon={getIcon("ExcelDocument")} />
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            style={{height:"300px"}}
          >
            <TablaEstilo configuracion={configuracion}>
            
              <DataGrid onSelectionChange={onSelectionChange}
              columns={columns} pageSize={5} autoHeight rows={historicData} checkboxSelection />
            </TablaEstilo>
          </Grid>
          
          
        </Grid>
      </div>
    </Contenedor>
  );
}

const mapStateToProps = estado => {
  return {
    configuracion: estado.configuracion,
    user: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Historic);