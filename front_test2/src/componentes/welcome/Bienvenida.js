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
    paddingTop: theme.spacing(3)
  },
  card: {
    display: 'flex',
    flexDirection: 'column'
  },
}));

const Bienvenida = ({ className, bienvenida }) => {
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
              color="textPrimary"
              gutterBottom
              variant="h4"
            >
              {"Bienvenida"}
            </Typography>
            <Typography
              align="center"
              color="textPrimary"
              variant="body1"
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