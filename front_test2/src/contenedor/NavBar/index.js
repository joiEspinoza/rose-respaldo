import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavItem from './NavItem';



const items = [
  {
    href: '/WelcomePage',
    icon: "HomeSolid",
    title: 'Inicio'
  },
  {
    href: '/Process',
    icon: "Processing",
    title: 'Procesos'
  },
  {
    href: '/Historic',
    icon: "HistoricalWeather",
    title: 'Histórico'
  },
  {
    href: '/Ayuda',
    icon: "Help",
    title: 'Ayuda'
  },
];

const useStyles = makeStyles((theme) => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  name: {
    color: theme.palette.primary.main,
    margin: theme.spacing(1),
  }
}));

const NavBar = ({ onMobileClose, openMobile, usuario }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    > 
      <Divider />
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={3}
      >
        {usuario.nombre.split(" ").map((item,index)=>(
          <Typography
          className={classes.name}
          variant="h4"
        >
          <Box fontWeight="fontWeightBold">
            {item}
          </Box>
        </Typography>
        ))}
      </Box>
      <Divider />
      <Box p={2} >
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
      
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
