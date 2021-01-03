import React from 'react';
import {
  Button,
  Grid,
  makeStyles
} from '@material-ui/core';
import { NavLink as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  
}));

const ProcessButton = ({ nombre, href, clickear }) => {
  const classes = useStyles();

  return (
    
    <Button
    variant="contained" color="primary"
    to={href}
    component={RouterLink}
    className={classes.root}
    onClick={clickear}
    >
    {nombre}
    </Button>
  );
};



export default ProcessButton;