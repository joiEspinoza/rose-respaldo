import React, { useState, useEffect } from 'react';
import { app, bd } from '../firebase/firebase';
import { Grid, Paper, Button, Typography } from '@material-ui/core';
import { Card, CardContent, CardActions } from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import { TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

const Home = (props) => {
  //let history = useHistory();
  useEffect(()=>{
    cargarTareasTest();
  },[]);
  const cargarTareas = () => {
    bd.collection("app").doc("tareas").get()
    .then(result => {
      var tareas = result.data();
      props.actualizarTask(tareas);
    }).catch(e => console.log(e.code==="permission-denied" && "No se puede acceder a la información, permiso denegado."));
  };
  const cargarTareasTest = () => {
    props.actualizarTask({
      tareas:[
        {
          nombre:"a",
          descripcion:"b",
          categoria:0,
          terminada:false,
        },
      ],
      categorias:[
        {
          nombre:"aa",
        },
      ],
    });
  };

  return (
    <Grid container>
        {(props.usuario === null) && <Grid item xs={12}>
        	<Typography variant="subtitle1" component="h2">
			  Hay que iniciar sesión para ver tareas.
			</Typography>
	    </Grid>}
	    
	    {(props.usuario !== null && props.tareas !== null) && <Grid item xs={12}>
	    	<Tareas usuario={props.usuario} tareas={props.tareas} actualizarTask={props.actualizarTask}/>
	    </Grid>}

	    
    </Grid>
  );
}

const Tareas = ({ usuario, tareas, actualizarTask }) => {
	const [form, setForm] = useState(false);
  return (
	<Grid container spacing={3}>
		<Grid item xs={12}>
			<Typography variant="h2" component="h2">
			  {"Tareas"}
			</Typography>
			{!form &&<Button onClick={()=>setForm(true)}>Crear Tarea</Button>}
		</Grid>
		{form && <Grid item xs={12}><CrearTarea setForm={setForm} tareas={tareas}/></Grid>}
		<Grid item xs={4}><Paper><UltimasCreadas tareas={tareas}/></Paper></Grid>
		<Grid item xs={4}><Paper><UltimasFinalizadas tareas={tareas}/></Paper></Grid>
		<Grid item xs={4}><Paper><Categorias tareas={tareas}/></Paper></Grid>
	</Grid>
  );
}

const CrearTarea = (props) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState(0);
  const history = useHistory();

  const crear = (evento) => {
    evento.preventDefault();
    var data = Object.assign({},{nombre:nombre,descripcion:descripcion,categoria:categoria,terminada:false});
    console.log(data);
    props.setForm(false);
    const nObjeto = Object.assign(props.tareas,{tareas:[...props.tareas.tareas,data]});
    bd.collection('app').doc("tareas").set(nObjeto);
    props.setForm(false);
    history.push("/");
  };

  
  const handleChange = (e) => {
    e.preventDefault();
    }
  return (
    <div className="Auth">
      <TextField label="Nombre" variant="outlined"
      name="nombre"
      value = {nombre}
      onChange={(e) => setNombre(e.target.value)}/><br/>
      <TextField label="Descripcion" variant="outlined"
      name="descripcion"
      value = {descripcion}
      onChange={(e) => setDescripcion(e.target.value)}/><br/>
      <InputLabel id={"categorias"}>Categoria</InputLabel>
        <Select
          labelId={"categorias"}
          id="demo-simple-select"
          value=''
          onChange={(e)=>setCategoria(e.target.value)}
        >
          {props.tareas.categorias.map((i,index)=>{
          return (
            <MenuItem
            key={index}
            value={index}
            >{i.nombre}</MenuItem>
            );
         })}
        </Select><br/>
      <Button onClick={crear}>Crear Tarea</Button>
    </div>
  );
}

const tipografiaStyle = makeStyles({
  root: {
    padding: 6,
    margin: 6,
  },
});

const Tipografia = (props) => {
  const classes = tipografiaStyle();
  return (
	<Typography className={classes.root} variant="h4" component="h2">
	  {props.children}
	</Typography>
  );
}

const UltimasCreadas = ({ tareas }) => {
  return (
	<Grid container>
		<Grid item xs={12}>
			<Tipografia>
			  {"Ultimas creadas"}
			</Tipografia>
		</Grid>
		{tareas.tareas.filter(i=>i.terminada===false).map((tarea, index) => (
			<Grid item xs={12}><Tarea tarea={Object.assign({},tarea,{categoria:tareas.categorias[tarea.categoria].nombre})}/></Grid>
		))}
		
	</Grid>
  );
}

const UltimasFinalizadas = ({ tareas }) => {
  return (
	<Grid container>
		<Grid item xs={12}>
			<Tipografia>
			  {"Ultimas finalizadas"}
			</Tipografia>
		</Grid>
		{tareas.tareas.filter(i=>i.terminada===true).map((tarea, index) => (
			<Grid item xs={12}><Tarea tarea={Object.assign({},tarea,{categoria:tareas.categorias[tarea.categoria].nombre})}/></Grid>
		))}
		
	</Grid>
  );
}

const acordionStyle = makeStyles((theme) => ({
   root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Categorias = ({ tareas }) => {
	const classes = acordionStyle();
	const categorias = tareas.categorias;

  return (
	<Grid className={classes.root} container>
		<Grid item xs={12}>
			<Tipografia>
			  {"Categorias"}
			</Tipografia>
		</Grid>
		{categorias.map((i, index)=>(<Acordion categoria={i.nombre} tareas={tareas.tareas.filter(t=>t.categoria===index)}/>))}
		
	</Grid>
  );
}



const Acordion = (props) => {
  const classes = acordionStyle();
  return (
	<Accordion>
	    <AccordionSummary
	      expandIcon={<ExpandMoreIcon />}
	      aria-controls="panel1a-content"
	      id="panel1a-header"
	    >
	      <Typography className={classes.heading}>{props.categoria}</Typography>
	    </AccordionSummary>
	    <AccordionDetails>
	      <Grid container>
	      	{props.tareas.map(i=>(<Grid item xs={12}>
	      		<Tarea tarea={i}/>
	      	</Grid>))}
		  </Grid>	
	    </AccordionDetails>
	  </Accordion>
  );
}


const tareaStyle = makeStyles({
  root: {
    minWidth: 275,
    margin: 6,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Tarea = ({ tarea }) => {
  const classes = tareaStyle();
  const bull = <span className={classes.bullet}>•</span>;

  return (
	<Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {"Tarea"}
        </Typography>
        <Typography variant="h5" component="h2">
          {tarea.nombre}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {tarea.categoria}
        </Typography>
        <Typography variant="body2" component="p">
          {tarea.descripcion}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">{tarea.terminada ? "Reabrir tarea" : "Terminar tarea"}</Button>
      </CardActions>
    </Card>
  );
}

const actualizarTareas = (tareas) => {
  return {
    type: 'ACTUALIZAR_TAREAS',
    tareas: tareas,
  }
}

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
    tareas: estado.tareas,
  }
}

const mapDispatchToProps = despachar => {
    return {
        actualizarTask: (tareas) => despachar(actualizarTareas(tareas)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);