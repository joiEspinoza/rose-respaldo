import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.purple[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.purple[900]
  },
  differenceValue: {
    color: colors.purple[900],
    marginRight: theme.spacing(1)
  }
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
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              {nombre}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {cantidad}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              {icon}
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


export default KPI;