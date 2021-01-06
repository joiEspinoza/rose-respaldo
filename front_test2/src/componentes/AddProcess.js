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
import AWS from 'aws-sdk';
import ReactS3Uploader from 'react-s3-uploader';



var bucketName = 'rosev0';
var bucketRegion = 'us-east-2';
var IdentityPoolId = 'us-east-2:38d700f2-c99b-4c9e-9686-6ce21337d610';

AWS.config.region = bucketRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: IdentityPoolId,});


const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});
//encodeURIComponent()
const uploadFile2 = (file,ruta) => {

s3.upload({
        Key: ruta,
        Body: file,
        ACL: 'public-read'
        }, function(err, data) {
        if(err) {
        console.log('error s3',err,data);
        }
        alert('Successfully Uploaded!');
        }).on('httpUploadProgress', function (progress) {
        var uploaded = parseInt((progress.loaded * 100) / progress.total);
        console.log(uploaded);
      });
}

const uploadFile22 = (file,ruta) => {
  
  
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: ruta,
      Body: file,
      ACL: "public-read"
    }
  });

  var promise = upload.promise();

  promise.then(
    function(data) {
      alert("Successfully uploaded photo.");
    },
    function(err) {
      return alert("There was an error uploading your photo: ", err.message);
    }
  );
  
}

const uploadFile222 = (file,ruta) => {
  var params = {
    Bucket: 'rosev0',
    Key: ruta,
    Expires: 60,
    ContentType: file.type,
    ACL: "public-read"
  };
  s3.getSignedUrl('putObject', params, function(err, signedUrl){
     if (err) {
          console.log("error papi",err);
          return err;
      } else {
          console.log("Exito papi",signedUrl);

          var instance = axios.create();

          instance.put(signedUrl, file, {headers: {'Content-Type': file.type}})
              .then(function (result) {
                  console.log(result);
              })
              .catch(function (err) {
                  console.log(err.code);
              });
          return signedUrl;
      }
  });
  
  
}






 
const config = (string) => {
  return {
    bucketName: 'rosev0',
    dirName: string, /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIAJEN4JB3CITFUIUFQ',
    secretAccessKey: '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',
  }
}



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
  const fileInput = useRef();
  const handleFile = evento => {
    evento.preventDefault();
    console.log(fileInput.current.files[0]);
  }

  const onUpload = (e) =>{
    console.log(e);
  }

  const [requirements_exp, setRequirements_exp] = useState([]);
  const [requirements_idioms, setRequirements_idioms] = useState([]);
  const [requirements_skills, setRequirements_skills] = useState([]);
  const [requirements_location, setRequirements_location] = useState([]);
  const [desired_exp, setDesired_exp] = useState([]);
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
        <Container maxWidth="md">
          <Formik
            initialValues={{
              name: "Vamos",
              description: "Proceso para desarrollador",
              vacant: 1,
              
              area: "Industrial",
              subarea: "TI",
              industry: "TI",
              is_remote: false,
              
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
              const cvs = fileInput.current.files[0];
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
                  "exp": requirements_exp,
                  "idioms": requirements_idioms,
                  "skills": requirements_skills,
                  "location": requirements_location,
                },
                "desired":{
                  "exp": desired_exp,
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
              console.log(payload);

              uploadFile(cvs,configu);

              //axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>{console.log(r);history.push('/');}).catch(e=>console.log(e));
              //uploadFile(cvs, configu)
                //.then(data => {
                //  console.log("archivo exito",data);
                //  axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>{console.log(r);history.push('/');}).catch(e=>console.log(e));
                //})
                //.catch(err => {
                //  console.error("error archivo",err);
                //  axios.post("http://127.0.0.1:8000/selection/create/",payload).then(r=>{console.log(r);history.push('/');}).catch(e=>console.log(e));
                //});
              
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
                        <ArrayInputNumber data={requirements_exp} set={setRequirements_exp} label={"Experiencia"}/>
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
                        <ArrayInputNumber data={desired_exp} set={setDesired_exp} label={"Experiencia"}/>
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
                        
                          Subir CV's
                          <input
                            type="file"
                            name="file"
                            ref={fileInput}
          
                          />
                          <ReactS3Uploader
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
                            />
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
    <Grid container direction="column" spacing={3}>
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
        <Grid container spacing={2}>
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