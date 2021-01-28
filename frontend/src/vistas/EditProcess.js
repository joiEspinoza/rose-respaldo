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
import Page from '../componentes/Page';
import axios from 'axios';
import { connect } from 'react-redux';
import Contenedor from '../contenedor';





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
  const [requirements_exp, setRequirements_exp] = useState(props.proceso["requirements"]["exp"]);
  const [requirements_idioms, setRequirements_idioms] = useState(props.proceso["requirements"]["idioms"]);
  const [requirements_skills, setRequirements_skills] = useState(props.proceso["requirements"]["skills"]);
  const [requirements_location, setRequirements_location] = useState(props.proceso["requirements"]["location"]);
  const [desired_exp, setDesired_exp] = useState(props.proceso["desired"]["exp"]);
  const [desired_skills, setDesired_skills] = useState(props.proceso["desired"]["skills"]);
  const [desired_college, setDesired_college] = useState(props.proceso["desired"]["college"]);
  const [desired_designation, setDesired_designation] = useState(props.proceso["desired"]["designation"]);
  const [desired_degree, setDesired_degree] = useState(props.proceso["desired"]["degree"]);
  return (
    <Contenedor >
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
                name: props.proceso["name"],
                description: props.proceso["description"],
                vacant: props.proceso["vacant"],
                
                area: props.proceso["area"],
                subarea: props.proceso["subarea"],
                industry: props.proceso["industry"],
                is_remote: props.proceso["is_remote"],
                requirements_exp: props.proceso["requirements"]["exp"],
                desired_exp: props.proceso["desired"]["exp"],
                
                
                
                
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().max(255).required('Nombre es requerido'),
                })
              }
              onSubmit={(values, actions) => {
                
                var payload = {
                  "name": values.name,
                  "vacant": values.vacant,
                  "description": values.description,
                  "area": values.area,
                  "subarea": values.subarea,
                  "industry": values.industry,
                  "is_remote": values.is_remote,
                  "status": props.proceso["status"],
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
                  "kpis": props.proceso["kpis"],
                  "storage_url": props.proceso["storage_url"],
                  "user": props.proceso["user"],
                };
                
                console.log(payload);
                axios.patch(`http://127.0.0.1:8000/selection/${props.proceso["id"]}/`,payload).then(r=>{
                  console.log(r);
                  history.push('/');
                }).catch(r=>{
                  console.log(r);
                });
                console.log(props.proceso);
                
                
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
                      Editar Proceso
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
    </Contenedor>
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
              <Badge color="primary"  badgeContent={"X"} onClick={()=>eliminar(index)}>
                <Button variant="contained" color="secondary" onClick={()=>actualizar(index)}>{i}</Button>
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
    proceso: estado.procesos.filter(i=>i.id===estado.proceso)[0]
  }
}

const mapDispatchToProps = despachar => {
    return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(AddProcess);