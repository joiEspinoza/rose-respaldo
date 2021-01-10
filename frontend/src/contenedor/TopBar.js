import React, { useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Icon } from '@fluentui/react/lib/Icon';
import rose_nav from '../images/rose_nav.jpg';

const useStyles = makeStyles(() => ({
  root: {
    height: 64,
  },
  avatar: {
    width: 60,
    height: 60
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notifications] = useState([]);

  return (
    <AppBar
      className={classes.root}
      elevation={0}
      {...rest}
    >
      <Toolbar>
          <img src={rose_nav} alt="rose" style={{
              height: '100%',
              width: 'auto',
            }} />
        <Box flexGrow={1} />
        <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <Icon style={{
                transform: 'scale(1.15)' // Tune it
              }} iconName={"Message"}  />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Icon style={{
                transform: 'scale(1.15)' // Tune it
              }} iconName={"Settings"}  />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};


export default TopBar;
