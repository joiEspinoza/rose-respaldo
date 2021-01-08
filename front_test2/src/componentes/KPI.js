import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    borderRadius: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,

  },
  root2: {
    height: '100%',
    borderRadius: theme.spacing(4),
    backgroundColor: theme.palette.secondary.main,

  },
  icono: {
    paddingTop: theme.spacing(6),
  },
}));

const KPI = ({ nombre, cantidad, icon }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={8}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ color: "white"}}
            >
              {nombre}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h1"
              style={{ color: "white"}}
            >
              {cantidad}
            </Typography>
          </Grid>
          <Grid item xs={4} >
              <div className={classes.icono}>
                {icon}
              </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const KPI2 = ({ nombre, cantidad }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root2}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={8}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              style={{ color: "white"}}
            >
              {nombre}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ color: "white"}}
            >
              {cantidad}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { KPI2 };

export default KPI;