import React, { useState } from 'react';
import { Container, makeStyles, Box } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    height: '100%',
    width:'100%',
    //overflow: 'auto',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    },
  },
  container: {
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const DashboardLayout = (props) => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box className={classes.root} height="100%">
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        usuario={props.usuario}
        
      />
      <Box className={classes.contentContainer} >
        <Container className={classes.container} maxWidth={false} >
          {props.children}
        </Container>
      </Box>
    </Box>
  );
};

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);