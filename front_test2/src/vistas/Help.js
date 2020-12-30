import React, { useState } from 'react';
import Contenedor from '../contenedor';
import Boton from '../componentes/Boton2';
import { 
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography
  } from '@material-ui/core';
import Youtube from 'react-youtube';
import { connect } from 'react-redux';

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
    			{tutorial ? <Tutoriales tutoriales={props.tutoriales}/> : <Issue2 />}
    		</Grid>
    	</Grid>
    </Contenedor>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
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

const mapStateToProps = estado => {
  return {
    tutoriales: estado.tutoriales,
  }
}
const mapDispatchToProps = despachar => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Help);