import React, { useState } from 'react';
import Contenedor from '../contenedor';
import Boton from '../componentes/Boton2';
import { Grid } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';

const Help = (props) => {
  const [tutorial, setTutorial] = useState(true);
  const irTutoriales = () => {
  	setTutorial(true);
  	console.log(tutorial);
  }
  const irIssues = () => {
  	setTutorial(false);
  	console.log(tutorial);
  }
  return (
    <Contenedor>
    	<Grid container>
    		<Grid item xs={12}>
    			<Grid container>
    				<Grid item xs={3}></Grid>
    				<Grid item xs={3}><Boton nombre={"Ver Tutoriales"} href={"#"} clickear={irTutoriales} /></Grid>
    				<Grid item xs={3}><Boton nombre={"Crear Incidencia"} href={"#"} clickear={irIssues} /></Grid>
    				<Grid item xs={3}></Grid>
    			</Grid>
    		</Grid>
    		<Grid item xs={12}>
    			{tutorial ? <Tutoriales /> : <Issue2 />}
    		</Grid>
    	</Grid>
    </Contenedor>
  );
}

const Tutoriales = (props) => {
  
  return (
    <p>
    {"Tutoriales"}
    </p>
  );
}

const Issue2 = (props) => {
  
  return (
    <p>
    {"Issue"}
    </p>
  );
}

const Issue = (props) => {
  
  return (
    <Contenedor>
    	<Grid container>
    		<Grid item xs={12}>
    			<Grid container>
    				<Grid item xs={3}></Grid>
    				<Grid item xs={3}><Boton nombre={"Ver Tutoriales"} href={"#"} /></Grid>
    				<Grid item xs={3}><Boton nombre={"Crear Incidencia"} href={"#"} /></Grid>
    				<Grid item xs={3}></Grid>
    			</Grid>
    		</Grid>
    		<Grid item xs={12}>
    		</Grid>
    	</Grid>
    </Contenedor>
  );
}

export default Help;