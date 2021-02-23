import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../Page';
import Profile from './Profile';
import Detalles from './Detalles';
import Contenedor from '../../contenedor';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(7)
  }
}));

const Perfil = (props) => {
  const classes = useStyles();

  return (
    <Page
      
      title="Account"
    >
      <Contenedor>
        <Grid
          container
          spacing={3}
          className={classes.root}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile usuario={props.usuario} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <Detalles usuario={props.usuario} configuracion={props.configuracion} despachar={props.dispatch}/>
          </Grid>
        </Grid>
      </Contenedor>
    </Page>
  );
};

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
    configuracion: estado.configuracion,
  }
}
const mapDispatchToProps = despachar => {
    return {
        dispatch: (i) => despachar(i),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Perfil);