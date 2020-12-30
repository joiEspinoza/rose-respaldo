import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.grisoscuro,
  },
}));

const Bienvenida = ({ className, bienvenida, children }) => {
  const classes = useStyles();

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
              {"Bienvenida"}
            </Typography>
          </CardContent>
        
          <CardContent>
            {children}
          </CardContent>
          <CardContent>
            <Typography
              align="center"
              color="textPrimary"
              variant="h5"
            >
              {bienvenida}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};


export default Bienvenida;