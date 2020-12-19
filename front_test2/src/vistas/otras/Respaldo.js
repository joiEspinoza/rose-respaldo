import React from 'react';
import Contenedor from '../contenedor';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from '../devias/components/Page';
import KPI from '../componentes/KPI';
import Budget from '../devias/views/reports/DashboardView/Budget';
import LatestOrders from '../devias/views/reports/DashboardView/LatestOrders';
import LatestProducts from '../devias/views/reports/DashboardView/LatestProducts';
import Sales from '../devias/views/reports/DashboardView/Sales';
import TasksProgress from '../devias/views/reports/DashboardView/TasksProgress';
import TotalCustomers from '../devias/views/reports/DashboardView/TotalCustomers';
import TotalProfit from '../devias/views/reports/DashboardView/TotalProfit';
import TrafficByDevice from '../devias/views/reports/DashboardView/TrafficByDevice';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
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
            <KPI nombre={"Cantidad CV"} cantidad={"10"}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <KPI nombre={"Tiempo ahorrado estimado"} cantidad={"20 h"}/>
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <KPI nombre={"Cantidad Procesos"} cantidad={"3"}/>
          </Grid>
          
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

const WelcomePage = (props) => {
  
  return (
    <Contenedor>
      <Dashboard />
    </Contenedor>
  );
}

export default WelcomePage;