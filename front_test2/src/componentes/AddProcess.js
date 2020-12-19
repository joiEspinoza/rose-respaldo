import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Checkbox,
  Container,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
  InputLabel,
  makeStyles
} from '@material-ui/core';
import Page from './Page';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const RegisterView = () => {
  const classes = useStyles();
  let history = useHistory();

  return (
    <Page
      className={classes.root}
      title="Add Process"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              password: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                firstName: Yup.string().max(255).required('First name is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
                password: Yup.string().max(255).required('password is required'),
                policy: Yup.boolean().oneOf([true], 'This field must be checked')
              })
            }
            onSubmit={(values, actions) => {
              
              //history.push('/WelcomePage');
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
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Nuevo Proceso
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Llena los campos
                  </Typography>
                </Box>
                <Grid container direction="row" spacing={2}>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="Nombre Proceso"
                      margin="normal"
                      name="nombreproceso"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="Nombre Vacante"
                      margin="normal"
                      name="nombrevacante"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="Numero"
                      margin="normal"
                      name="numero"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <InputLabel id="vacantes">Vacantes</InputLabel>
                    <Select
                      labelId="vacantes"
                      fullWidth
                      label="Numero"
                      margin="normal"
                      name="numero"
                      onChange={handleChange}
                      variant="outlined"

                      
                    >
                      <MenuItem value={1}>Uno</MenuItem>
                      <MenuItem value={2}>Dos</MenuItem>
                      <MenuItem value={3}>Tres</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Grid container direction="row" spacing={2}>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="Area"
                      margin="normal"
                      name="area"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      error={Boolean(touched.firstName && errors.firstName)}
                      fullWidth
                      helperText={touched.firstName && errors.firstName}
                      label="Subarea"
                      margin="normal"
                      name="subarea"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item>
                    <InputLabel id="industria">Industria</InputLabel>
                    <Select
                      fullWidth
                      labelId="industria"
                      margin="normal"
                      name="industria"
                      onChange={handleChange}
                      variant="outlined"
                      value={4}
                    >
                      <MenuItem value={1}>Agro</MenuItem>
                      <MenuItem value={2}>Tech</MenuItem>
                      <MenuItem value={3}>Fin</MenuItem>
                      <MenuItem value={4}>AI</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <FormControlLabel
                    control={<Switch checked={values.remoto} onChange={handleChange} name="remoto" />}
                    label="Remoto"
                  />
                
                  
                </Box>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography variant="h5">Requisitos Mínimos</Typography>
                      </Grid>
                      <Grid item>
                        <InputLabel id="experiencia1">Experiencia</InputLabel>
                          <Select
                            fullWidth
                            labelId="experiencia1"
                            margin="normal"
                            name="experiencia1"
                            onChange={handleChange}
                            variant="outlined"
                            value={4}
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                          </Select>
                      </Grid>
                      <Grid item>
                        <InputLabel id="tipo">Tipo</InputLabel>
                        <Select
                            fullWidth
                            labelId="experiencia1"
                            margin="normal"
                            name="tipo"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            <MenuItem value={1}>Profesional</MenuItem>
                            <MenuItem value={2}>Tecnico</MenuItem>
                          </Select>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label="Skills"
                          margin="normal"
                          name="skills1"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <InputLabel id="idioma1">Idioma</InputLabel>
                        <Select
                            fullWidth
                            labelId="idioma1"
                            margin="normal"
                            name="idioma1"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            <MenuItem value={1}>Español</MenuItem>
                            <MenuItem value={2}>Inglés</MenuItem>
                            <MenuItem value={3}>Catalán</MenuItem>
                            <MenuItem value={4}>Portugués</MenuItem>
                          </Select>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label="Lugar"
                          margin="normal"
                          name="lugar"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography variant="h5">Requisitos Deseables</Typography>
                      </Grid>
                      <Grid item>
                        <InputLabel id="experiencia2">Experiencia</InputLabel>
                        <Select
                            fullWidth
                            labelId="experiencia2"
                            margin="normal"
                            name="experiencia2"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                          </Select>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label="Skills"
                          margin="normal"
                          name="skills2"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <InputLabel id="idioma2">Idioma</InputLabel>
                        <Select
                            fullWidth
                            labelId="idioma2"
                            margin="normal"
                            name="idioma2"
                            onChange={handleChange}
                            variant="outlined"
                          >
                            <MenuItem value={1}>Español</MenuItem>
                            <MenuItem value={2}>Inglés</MenuItem>
                            <MenuItem value={3}>Catalán</MenuItem>
                            <MenuItem value={4}>Portugués</MenuItem>
                          </Select>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label="Universidad"
                          margin="normal"
                          name="universidad"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.firstName && errors.firstName)}
                          fullWidth
                          helperText={touched.firstName && errors.firstName}
                          label="Lugar"
                          margin="normal"
                          name="lugar2"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="column" justify="flex-end" alignItems="center" spacing={2} >
                      <Grid item>
                        <Button
                          variant="contained"
                          component="label"
                        >
                          Upload File
                          <input
                            type="file"
                            name="file"
                            hidden
                          />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Box my={2}>
                          <Button
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                          >
                            ¡Traeme a los mejores!
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                
                
                
                
                
                
                
                
                
                
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;