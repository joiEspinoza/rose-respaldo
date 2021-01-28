import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import axios from 'axios';



const useStyles = makeStyles(() => ({
  root: {}
}));

const Detalles = ({ usuario, configuracion, despachar, className, ...rest }) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    threshold: configuracion.threshold,
    timezone: configuracion.timezone,
    primarycolor: configuracion.primary_color===undefined ? '' : configuracion.primary_color,
    secondarycolor: configuracion.secondary_color===undefined ? '' : configuracion.secondary_color,
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const actualizarColores = () => {
    axios.post("http://127.0.0.1:8000/selection/colors/",
      {"primary_color":values.primarycolor,"secondary_color":values.secondarycolor,"user_mail":usuario.correo}
    ).then(r=>{
      console.log(r);
      despachar({
        type: 'CARGAR_CONFIGURACION',
        newState: Object.assign({},configuracion,{primary_color:values.primarycolor,secondary_color:values.secondarycolor}),
      });
    }).catch(r=>{console.log(r);});
  }

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Colores e información de cuenta"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <Typography variant="h6">
                {"Treshold: "}{configuracion.threshold}
              </Typography>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <Typography variant="h6">
                {"Zona Horaria: "}{configuracion.timezone}
              </Typography>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Color primario"
                name="primarycolor"
                onChange={handleChange}
                required
                value={values.primarycolor}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Color secundario"
                name="secondarycolor"
                onChange={handleChange}
                value={values.secondarycolor}
                variant="outlined"
              />
            </Grid>
            
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={actualizarColores}
          >
            Actualizar colores
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default Detalles;
