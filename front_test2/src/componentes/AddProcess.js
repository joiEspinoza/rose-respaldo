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
import { connect } from 'react-redux';
import { uploadFile } from 'react-s3';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIAJEN4JB3CITFUIUFQ',
  secretAccessKey: '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'
})

const myBucket = new AWS.S3({
  params: { Bucket: 'rosev0'},
  region: 'us-west-2',
})

const uploadFile2 = (file,ruta) => {
  const params = {
    ACL: 'public-read',
    Key: ruta,
    ContentType: file.type,
    Body: file,
  }
  myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => console.log("evt",evt))
    .send((err) => {
       if (err) {
         console.log("err",err);
       }
    })
}






 
const config = (string) => {
  return {
    bucketName: 'rosev0',
    dirName: string, /* optional */
    region: 'us-west-2',
    accessKeyId: 'AKIAJEN4JB3CITFUIUFQ',
    secretAccessKey: '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',
  }
}

{/*
uploadFile(values.file, configu)
                .then(data => {
                  console.log("archivo exito",data);
                  axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>console.log(r)).catch(e=>console.log(e));
                })
                .catch(err => console.error("error archivo",err));
*/}

const fecha = () => {
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let ano = fecha.getFullYear();
  if(mes < 10){
    return `${dia}-0${mes}-${ano}`;
  }else{
    return `${dia}-${mes}-${ano}`;
  }
}


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const AddProcess = (props) => {
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
              name: "",
              vacant: 1,
              description: "",
              area: "",
              subarea: "",
              industry: "",
              is_remote: false,
              exp: 1,
              idioms: "",
              skills: "",
              location: "",
              desired_exp: 1,
              desired_idioms: "",
              desired_skills: "",
              desired_college: "",
              desired_designation: "",
              file: null,
              
            }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().max(255).required('Nombre es requerido'),
              })
            }
            onSubmit={(values, actions) => {
              var date = fecha();
              var email_cambiado = props.usuario.correo.replace("@","_");
              var name_cambiado = values.name.replaceAll(" ","_");
              var ruta = `${email_cambiado}/${date}*${name_cambiado}*input/`;
              var payload = {
                "name": values.name,
                "vacant": values.vacant,
                "description": values.description,
                "area": values.area,
                "subarea": values.subarea,
                "industry": values.industry,
                "is_remote": values.is_remote,
                "status": "In progress",
                "requirements":{
                  "exp": values.exp,
                  "idioms": values.idioms,
                  "skills": values.skills,
                  "location": values.location,
                },
                "desired":{
                  "exp": [values.desired_exp],
                  "idioms": [values.desired_idioms],
                  "skills": [values.desired_skills],
                  "college": [values.desired_college],
                  "designation": [values.desired_designation],
                },
                "kpis": {},
                "storage_url": ruta,
                "user": props.usuario.correo,
              };
              console.log(payload);
              console.log(values.file);
              let configu = config(ruta);
              console.log(configu);
              //uploadFile2(values.file,ruta);
              uploadFile(values.file, configu)
                .then(data => {
                  console.log("archivo exito",data);
                  axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>console.log(r)).catch(e=>console.log(e));
                })
                .catch(err => console.error("error archivo",err));
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
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={4}>
                    <TextField
                      error={Boolean(touched.name && errors.name)}
                      fullWidth
                      helperText={touched.name && errors.name}
                      label="Nombre Proceso"
                      margin="normal"
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      error={Boolean(touched.vacant && errors.vacant)}
                      fullWidth
                      helperText={touched.vacant && errors.vacant}
                      label="Vacantes"
                      type="number"
                      margin="normal"
                      name="vacant"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.vacant}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      error={Boolean(touched.description && errors.description)}
                      fullWidth
                      helperText={touched.description && errors.description}
                      label="Descripción del proceso"
                      margin="normal"
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.area && errors.area)}
                      fullWidth
                      helperText={touched.area && errors.area}
                      label="Área"
                      margin="normal"
                      name="area"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.area}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.subarea && errors.subarea)}
                      fullWidth
                      helperText={touched.subarea && errors.subarea}
                      label="Subárea"
                      margin="normal"
                      name="subarea"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.subarea}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      error={Boolean(touched.industry && errors.industry)}
                      fullWidth
                      helperText={touched.industry && errors.industry}
                      label="Industria"
                      margin="normal"
                      name="industry"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.industry}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid xs={2}>
                    <FormControlLabel
                      control={<Switch checked={values.is_remote} onChange={handleChange} name="is_remote" />}
                      label="¿Es remoto?"
                      labelPlacement="top"
                    />

                  </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" spacing={4}>
                  <Grid item xs={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Typography variant="h5">Requisitos Mínimos</Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.exp && errors.exp)}
                          fullWidth
                          helperText={touched.exp && errors.exp}
                          label="Experiencia"
                          type="number"
                          margin="normal"
                          name="exp"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.exp}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.idioms && errors.idioms)}
                          fullWidth
                          helperText={touched.idioms && errors.idioms}
                          label="Idioma"
                          margin="normal"
                          name="idioms"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.idioms}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.skills && errors.skills)}
                          fullWidth
                          helperText={touched.skills && errors.skills}
                          label="Skills"
                          margin="normal"
                          name="skills"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.skills}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.location && errors.location)}
                          fullWidth
                          helperText={touched.location && errors.location}
                          label="Lugar"
                          margin="normal"
                          name="location"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.location}
                          variant="outlined"
                        />
                      </Grid>
                      
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Typography variant="h5">Requisitos Deseables</Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.desired_exp && errors.desired_exp)}
                          fullWidth
                          helperText={touched.desired_exp && errors.desired_exp}
                          label="Experiencia deseada"
                          type="number"
                          margin="normal"
                          name="desired_exp"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.desired_exp}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.desired_idioms && errors.desired_idioms)}
                          fullWidth
                          helperText={touched.desired_idioms && errors.desired_idioms}
                          label="Idiomas deseados"
                          margin="normal"
                          name="desired_idioms"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.desired_idioms}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.desired_college && errors.desired_college)}
                          fullWidth
                          helperText={touched.desired_college && errors.desired_college}
                          label="Casa de estudios"
                          margin="normal"
                          name="desired_college"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.desired_college}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={Boolean(touched.desired_designation && errors.desired_designation)}
                          fullWidth
                          helperText={touched.desired_designation && errors.desired_designation}
                          label="Cargos"
                          margin="normal"
                          name="desired_designation"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.desired_designation}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={3} >
                      <br/><br/><br/><br/>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          component="label"
                          fullWidth={true}
                          style={{ "min-height": "100px" }}
                        >
                          Subir CV's
                          <input
                            type="file"
                            name="file"
                            onChange={handleChange}
                            value={values.file}
                            hidden
                          />
                        </Button>
                      </Grid>
                      <Grid item>
                        <Box my={2}>
                          <Button
                            color="primary"
                            disabled={false}
                            style={{ "min-height": "100px" }}
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


const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProcess);