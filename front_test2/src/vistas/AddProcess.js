import React from 'react';
import Contenedor from '../contenedor';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Page from '../componentes/Page';
import KPI from '../componentes/KPI';
import Bienvenida from '../componentes/welcome/Bienvenida';
import Procesos from '../componentes/Procesos';
import ProcessButton from '../componentes/Boton';
import AddProceso from '../componentes/AddProcess';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));
const Dashboard = (props) => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            
          </Grid>
          
          
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            {"sadf"}
          </Grid>
          
        </Grid>
      </Container>
    </Page>
  );
};

const AddProcess = (props) => {
  
  return (
    <Contenedor>
      <AddProceso />
    </Contenedor>
  );
}

export default AddProcess;