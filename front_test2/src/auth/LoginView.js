import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';
import MicroSoft from '../rose/Microsoft';
import Google from '../rose/Google';
import { connect } from 'react-redux';
import Page from '../componentes/Page';
import rosee from '../images/rose_title.png';


const useStyles = makeStyles((theme) => ({
  form: {
    backgroundColor: "white",
    padding: theme.spacing(5),
    borderRadius: theme.spacing(7),
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      borderRadius: theme.spacing(5),
    },
  },
  container: {
    backgroundColor: theme.palette.success.main,
    height: window.innerHeight,
  },
}));


const LoginView = (props) => {
  const classes = useStyles();
  let history = useHistory();
  return (
    
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      className={classes.container}
    >
      <Container maxWidth="sm" className={classes.form} >
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Debe ser un email válido').max(255).required('El email es requirido'),
            password: Yup.string().max(255).required('La contraseña es requerida')
          })}
          onSubmit={(values, actions) => {
            console.log({"email":values.email,"password":values.password});
            axios.post("http://127.0.0.1:8000/auth/login/",
              {"email":values.email,"password":values.password}
            ).then(r=>{
              console.log(r);
              props.actualizarUser({
                nombre:r.data.username,
                correo: r.data.email,
                response: r,
              });
              history.push('/WelcomePage');
            }).catch(r=>{console.log(r);history.push('/');});
            
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit} >
              <Box mb={3}>
                <img src={rosee} alt="rose" width="100%"/>
              </Box>
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label="Correo"
                margin="normal"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                helperText={touched.password && errors.password}
                label="Contraseña"
                margin="normal"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
              <Box my={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Ingresar
                </Button>
              </Box>
              <Box
                mt={3}
                mb={1}
              >
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="body1"
                >
                  o ingresa con
                </Typography>
              </Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  xs={2}
                  md={4}
                ></Grid>
                <Grid
                  item
                  xs={4}
                  md={2}
                >
                  <MicroSoft actualizarUser={props.actualizarUser}/>
                </Grid>
                
                <Grid
                  item
                  xs={4}
                  md={2}
                >
                  <Google actualizarUser={props.actualizarUser}/>
                </Grid>
                <Grid
                  item
                  xs={2}
                  md={4}
                ></Grid>
              </Grid>
              
            </form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

const EnlaceRegistro = (props) => {
  return(
    <Typography
      color="textSecondary"
      variant="body1"
    >
      ¿No tienes cuenta?
      {' '}
      <Link
        component={RouterLink}
        to="/registro"
        variant="h6"
      >
        Registrate
      </Link>
    </Typography>
  );
}
const actualizarUsuario = (usuario) => {
  return {
    type: 'ACTUALIZAR_USUARIO',
    usuario: usuario,
  }
}


const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {
        actualizarUser: (usuario) => despachar(actualizarUsuario(usuario)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);

