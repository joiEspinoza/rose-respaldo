import React from 'react';
import {
  Button,
  Grid,
  makeStyles
} from '@material-ui/core';
import { NavLink as RouterLink } from 'react-router-dom';
import { Icon } from '@fluentui/react/lib/Icon';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  
}));

const ProcessButton = ({ nombre, href, color, icon }) => {
  const classes = useStyles();

  return (
    
    <Button
    variant="contained" color={color}
    to={href}
    component={RouterLink}
    className={classes.root}
    endIcon={<Icon style={{
      transform: 'scale(1.5)' // Tune it
    }} iconName={icon}  />}
    >
    {nombre} 
    </Button>
  );
};



export default ProcessButton;