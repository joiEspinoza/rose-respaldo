import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Icon } from '@fluentui/react/lib/Icon';
import {
  Box,
  FormControlLabel,
  Switch,
  Badge,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from './Page';
import axios from 'axios';
import { connect } from 'react-redux';
import { uploadFile } from 'react-s3';




const subirIterativo = (archivos,configu,iteracion,errores,payload) => {
  if(iteracion<archivos.length){
    uploadFile(archivos[iteracion],configu)
      .then(e=>{
        console.log("Subido",archivos[iteracion].name);
        subirIterativo(archivos,configu,iteracion+1,errores,payload);
      })
      .catch(e=>{
        console.log("Error",archivos[iteracion].name);
        errores.push(archivos[iteracion].name);
        subirIterativo(archivos,configu,iteracion,errores,payload);
      });
  }else{
    console.log("Todos subidos",errores);
    axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>{
      console.log(r);
    }).catch(r=>{
      console.log(r);
    });
  }
}


 
const config = (string) => {
  return {
    bucketName: 'rosev0',
    dirName: string, /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIA5XKDKZ4KRSBLKVGI',
    secretAccessKey: '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',
  }
}



const fecha = () => {
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let ano = fecha.getFullYear();
  if(mes < 10){
    if(dia < 10){
      return `0${dia}-0${mes}-${ano}`;
    }else{
      return `${dia}-0${mes}-${ano}`;
    }
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
  const fileInput = useRef();
  const handleFile = evento => {
    evento.preventDefault();
    console.log(fileInput.current.files[0]);
  }

  const onUpload = (e) =>{
    console.log(e);
  }

  const [hacerSubida, definirS] = useState(false);
  const [hacerRequest, definirR] = useState(false);

  const [requirements_idioms, setRequirements_idioms] = useState([]);
  const [requirements_skills, setRequirements_skills] = useState([]);
  const [requirements_location, setRequirements_location] = useState([]);
  const [desired_skills, setDesired_skills] = useState([]);
  const [desired_college, setDesired_college] = useState([]);
  const [desired_designation, setDesired_designation] = useState([]);
  const [desired_degree, setDesired_degree] = useState([]);
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
        <Container maxWidth="lg">
          <Formik
            initialValues={{
              name: "Vamos",
              description: "Proceso para desarrollador",
              vacant: 1,
              
              area: "Industrial",
              subarea: "TI",
              industry: "TI",
              is_remote: false,
              requirements_exp: 1,
              desired_exp: 1,
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
              const cvs = fileInput.current.files;
              var ruta = `${email_cambiado}/${date}*${name_cambiado}*input`;
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
                  "exp": values.requirements_exp,
                  "idioms": requirements_idioms,
                  "skills": requirements_skills,
                  "location": requirements_location,
                },
                "desired":{
                  "exp": values.desired_exp,
                  "skills": desired_skills,
                  "college": desired_college,
                  "designation": desired_designation,
                  "degree": desired_degree,
                },
                "kpis": {},
                "storage_url": ruta,
                "user": props.usuario.correo,
              };
              
              let configu = config(ruta);
              definirS(true);
              subirIterativo(cvs,configu,0,[],payload);
              
              
              
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
                          error={Boolean(touched.requirements_exp && errors.requirements_exp)}
                          fullWidth
                          helperText={touched.requirements_exp && errors.requirements_exp}
                          label="Experiencia mínima"
                          type="number"
                          margin="normal"
                          name="requirements_exp"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.requirements_exp}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <ArrayInput data={requirements_idioms} set={setRequirements_idioms} label={"Idiomas"}/>
                      </Grid>
                      <Grid item>
                        <ArrayInput data={requirements_skills} set={setRequirements_skills} label={"Skills"}/>
                      </Grid>
                      <Grid item>
                        <ArrayInput data={requirements_location} set={setRequirements_location} label={"Lugar"}/>
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
                        <ArrayInput data={desired_skills} set={setDesired_skills} label={"Skills"}/>
                      </Grid>
                      <Grid item>
                        <ArrayInput data={desired_designation} set={setDesired_designation} label={"Cargos"}/>
                      </Grid>
                      <Grid item>
                        <ArrayInput data={desired_college} set={setDesired_college} label={"Universidades"}/>
                      </Grid>
                      <Grid item>
                        <ArrayInput data={desired_degree} set={setDesired_degree} label={"Títulos"}/>
                      </Grid>
                      
                      
                      
                     
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid container direction="column" justify="center" alignItems="center" spacing={3} >
                      <br/><br/><br/><br/>
                      <Grid item xs={12}>
                        
                          
                          <Button
                            color="primary"
                            fullWidth
                            variant="contained"
                            component="label"
                            size="large"
                            style={{ "min-height": "150px", "min-width": "200px" }}
                          >
                            Subir CV's
                            <input
                              type="file"
                              name="file"
                              hidden
                              multiple="multiple"
                              ref={fileInput}
            
                            />
                          </Button>
                          {/*<ReactS3Uploader
                            signingUrl="/s3/sign"
                            signingUrlMethod="GET"
                            accept=".zip,.rar,.7zip"
                            s3path="/uploads/"
                            onProgress={onUpload}
                            onError={onUpload}
                            onFinish={onUpload}
                            
                            uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                            
                            ref={fileInput}
                            contentDisposition="auto"
                            />*/}
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

const ArrayInputNumber = ({ data, set, label }) => {
  const [valor, setValor] = useState(1);
  const definir = () => {
    set([...data, Number(valor)]);
    setValor(1);
  }
  const actualizar = (i) => {
    setValor(data[i]);
    set([...data.slice(0,i), ...data.slice(i+1)]);
  }
  const eliminar = (i) => {
    set([...data.slice(0,i), ...data.slice(i+1)]);
  }
  const inputtext = (e) => {
    e.preventDefault();
    setValor(e.target.value);
  }
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item xs={12}>
        <Grid container direction="row" spacing={0}>
          <Grid item xs={10}>
            <TextField variant="outlined" label={label} type="number" fullWidth value={valor} onChange={inputtext}/>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={definir}>
              <Icono nombre={'CircleAdditionSolid'} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={0}>
          {data.map((i,index)=>(
            <Grid item>
              <Badge color="secondary"  badgeContent={"X"} onClick={()=>eliminar(index)}>
                <Button variant="outlined" color="primary" onClick={()=>actualizar(index)}>{i}</Button>
              </Badge>
            </Grid>
          ))}
          
        </Grid>
      </Grid>
    </Grid>
    
  );
}

const ArrayInput = ({ data, set, label }) => {
  const [valor, setValor] = useState("");
  const definir = () => {
    set([...data, valor.toLowerCase()]);
    setValor("");
    console.log(data);
  }
  const actualizar = (i) => {
    setValor(data[i]);
    set([...data.slice(0,i), ...data.slice(i+1)]);
  }
  const eliminar = (i) => {
    set([...data.slice(0,i), ...data.slice(i+1)]);
  }
  const inputtext = (e) => {
    e.preventDefault();
    setValor(e.target.value);
  }
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item xs={12}>
        <Grid container direction="row" spacing={0}>
          <Grid item xs={10}>
            <TextField variant="outlined" label={label} type="text" fullWidth value={valor} onChange={inputtext}/>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={definir}>
              <Icono nombre={'CircleAdditionSolid'} />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      {data.length !== 0 && <Grid item xs={12}>
        <Grid container spacing={2}>
          {data.map((i,index)=>(
            <Grid item>
              <Badge color="secondary"  badgeContent={"X"} onClick={()=>eliminar(index)}>
                <Button variant="outlined" color="primary" onClick={()=>actualizar(index)}>{i}</Button>
              </Badge>
            </Grid>
          ))}
        </Grid>
      </Grid>} 
      
        
      
    </Grid>
    
  );
}

const Icono = ({ nombre }) => {
  return(
    <Icon style={{
      transform: 'scale(1.5)' 
    }} iconName={nombre}  />
  );
}

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProcess);