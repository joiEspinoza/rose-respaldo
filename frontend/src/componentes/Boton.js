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
    height: '100%',
    paddingTop: '40px',
    paddingBottom: '40px',
    borderRadius: theme.spacing(4),
  },
  
}));

const ProcessButton = ({ nombre, href, color, icon, desactivado=false }) => {
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
    disabled={desactivado}
    >
    {nombre} 
    </Button>
  );
};



export default ProcessButton;