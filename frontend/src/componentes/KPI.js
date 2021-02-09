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
    backgroundColor: theme.palette.grisoscuro,
    paddingTop: theme.spacing(2),

  },
  icono: {
    paddingTop: theme.spacing(6),
  },
  icono2: {
    paddingTop: theme.spacing(3),
  },
  icono3: {
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(3),
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

const KPI2 = ({ nombre, cantidad, icon }) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root2}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={0}
        >
          <Grid item xs={7}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body1"
              align="center"
              style={{ color: "white", overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {nombre}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
              align="center"
              style={{ color: "white"}}
            >
              {cantidad}
            </Typography>
          </Grid>
          <Grid item xs={4} >
            <Typography
              align="center"
              className={classes.icono2}
            >
              {icon}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const KPI3 = ({ nombre, cantidad, icon }) => {
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
          <Grid item xs={6}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              style={{ color: "white"}}
            >
              {nombre}
            </Typography>
          </Grid>
          <Grid item xs={3} >
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ color: "white"}}
            >
              {cantidad}
            </Typography>
          </Grid>
          <Grid item xs={2} >
              <div className={classes.icono3}>
                {icon}
              </div>
          </Grid>
          <Grid item xs={1} ></Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export { KPI2, KPI3 };

export default KPI;