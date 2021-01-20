import React, { useState } from 'react';
import Contenedor from '../contenedor';
import Boton from '../componentes/Boton2';
import Editor from '../componentes/Editor';
import { EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { 
  Card,
  Button,
  CardContent,
  Grid,
  makeStyles,
  TextField,
  Typography
  } from '@material-ui/core';
import Youtube from 'react-youtube';
import { connect } from 'react-redux';
import { NAHelp } from '../componentes/NA';

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
    			<Grid container spacing={2}>
    				<Grid item xs={3}></Grid>
    				<Grid item xs={3}><Boton nombre={"Ver Tutoriales"} desactivado={props.tutoriales === null} href={"#"} clickear={irTutoriales} /></Grid>
    				<Grid item xs={3}><Boton nombre={"Crear Incidencia"} href={"#"} clickear={irIssues} /></Grid>
    				<Grid item xs={3}></Grid>
    			</Grid>
    		</Grid>
    		<Grid item xs={12}>
    			{tutorial ? 
            <>{props.tutoriales === null ?
              <NAHelp mensaje="Tutoriales no disponibles"/>
            :
              <Tutoriales tutoriales={props.tutoriales}/> 
            }</>
          : <Issue />}
    		</Grid>
    	</Grid>
    </Contenedor>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.grisoscuro,
  },
  nombre: {
    paddingTop: theme.spacing(5),
  },
  descripcion: {
    paddingTop: theme.spacing(4),

  },
}));

const Tutoriales = ({ className, tutoriales }) => {
  const classes = useStyles();
  const youtube_options = {
    height: '360',
    width: '600',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const data = tutoriales.data;
  console.log("Tuto",data);
  const getVideoId = (string) =>{
    const separador = 'https://www.youtube.com/watch?v=';
    return string.split(separador)[1];
  };
  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Card
          className={classes.card}
        >
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant="h1"
            >
              {"Tutoriales"}
            </Typography>
          </CardContent>
          {tutoriales !== null ? 
            <>
            {data.map((i,index)=>(
              <CardContent>
                <Grid container>
                  <Grid item xs={6}>
                    <Youtube
                      videoId={getVideoId(i.value)}
                      opts={youtube_options}
                      onReady={_onReady}
                    />
                  </Grid>
                  <Grid item xs={1}>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography
                          align="center"
                          color="textPrimary"
                          variant="h5"
                          className={classes.nombre}
                        >
                          {i.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          align="center"
                          color="textPrimary"
                          variant="body1"
                          className={classes.descripcion}
                        >
                          {i.description}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
              </CardContent>
            ))}</>
          :
            <>"Tutoriales aún no cargados"</>
          }
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <Youtube
                  videoId={"I-1oJnmr6nk"}
                  opts={youtube_options}
                  onReady={_onReady}
                />
              </Grid>
              <Grid item xs={1}>
              </Grid>
              <Grid item xs={4}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      color="textPrimary"
                      variant="h5"
                      className={classes.nombre}
                    >
                      {"Un tema"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      color="textPrimary"
                      variant="body1"
                      className={classes.descripcion}
                    >
                      {"Para distraerse"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};



const Issue = (props) => {
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  const classes = useStyles();
  const history = useHistory();
  return (
  	<Grid container className={classes.root} spacing={3}>
  		<Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <Card className={classes.card}>
          <Formik
            initialValues={{
              titulo: '',
              email: '',
              modulo: '',
            }}
            validationSchema={Yup.object().shape({
              titulo: Yup.string().max(255).required('Debe definir un titulo para el problema'),
              email: Yup.string().email('Debe ser un email válido').max(255).required('El email es requirido'),
              modulo: Yup.string().max(255).required('Debe definir el módulo del error')
            })}
            onSubmit={(values, actions) => {
              const data = {
                "name":values.titulo,
                "user":values.email,
                "module":values.modulo,
                "code":"1",
                "summary":html
              };
              console.log(data);
              axios.post(`http://127.0.0.1:8000/selection/issues/create/`,data).then(r=>{
                console.log(r);
              }).catch(r=>{
                console.log(r);
              });         
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit} >
                <CardContent>
            			<Grid container spacing={3}>
            				<Grid item xs={6}>
                      <TextField
                        error={Boolean(touched.titulo && errors.titulo)}
                        fullWidth
                        helperText={touched.titulo && errors.titulo}
                        label="Título del problema"
                        margin="normal"
                        name="titulo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.titulo}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        helperText={touched.email && errors.email}
                        label="Email de contacto"
                        margin="normal"
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.modulo && errors.modulo)}
                        fullWidth
                        helperText={touched.modulo && errors.modulo}
                        label="Módulo del problema"
                        margin="normal"
                        name="modulo"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.modulo}
                        variant="outlined"
                      />
                    </Grid>
            			</Grid>
                </CardContent>
                <CardContent>
                  <Editor editorState={editorState} setEditorState={setEditorState}/>
                </CardContent>
                <CardContent>
                  <Button variant="contained" type="submit" color="primary">
                    {"Crear incidencia"}
                  </Button>
                </CardContent>
              </form>
            )}
          </Formik>
        </Card>
  		</Grid>
      <Grid item xs={1}></Grid>
  		
        
  	</Grid>
  );
}

const mapStateToProps = estado => {
  return {
    tutoriales: estado.tutoriales,
  }
}
const mapDispatchToProps = despachar => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Help);