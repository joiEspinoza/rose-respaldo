import React, { useState } from 'react';
import Dialogo from '../Dialogo';
import Editor from '../Editor';
import { Grid, InputAdornment, Switch, FormControlLabel, IconButton, Container, Button, makeStyles, Card, CardContent, TextField } from '@material-ui/core';
import { EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Icon } from '@fluentui/react/lib/Icon';
import * as moment from 'moment'
import axios from 'axios';

const Calendar = (props) => {
  const { setOpen, open, candidato, user } = props;
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  return (
    <Dialogo setOpen={setOpen} open={open} titulo={"Nueva calendarización"} >
      <Formulario candidato={candidato} user={user} setModalOpen={setOpen} />
  	</Dialogo>
  );
}

const fecha = () => {
  let fecha = new Date();
  let dia = fecha.getDate();
  let mes = fecha.getMonth() + 1;
  let ano = fecha.getFullYear();
  if(mes < 10){
    if(dia < 10){
      return `${ano}-0${mes}-0${dia}T10:00:00`;
    }else{
      return `${ano}-0${mes}-${dia}T10:00:00`;
    }
  }else{
    return `${ano}-${mes}-${dia}T10:00:00`;
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.grisoscuro,
  },
  nombre: {
    paddingTop: theme.spacing(5),
  },
  descripcion: {
    paddingTop: theme.spacing(4),

  },
}));

const Formulario = ({ user, candidato, setModalOpen }) => {
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  const classes = useStyles();
  const today = moment();
  const defaultStartDate = today.format().substr(0, 19)
  const defaultEndDate = today.add('1', 'hours').format().substr(0, 19)
  const accessToken = (user && user.response) ? user.response.accessToken : null

  const onSubmit = (values) => {
    const data = {
      type: "meeting",
      info: {
        subject: values.asunto,
        content: html,
        start: values.fecha1,
        end: values.fecha2,
        attendees: [candidato.mail]
      },
      user: user.correo
    }
    axios
      .post(`https://rosev0-dev-api.myfuture.ai/selection/create_event/${accessToken}`, data)
      .then(() => {
        alert('Evento agregado al calendario exitosamente!')
        setModalOpen(false)
      })
      .catch(error => console.log(error));
  }

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <Formik
            initialValues={{
              nombre: 'Entrevista de selección',
              fecha1: defaultStartDate,
              fecha2: defaultEndDate,
              asunto: `Entrevista con ${candidato.name}`,
            }}
            validationSchema={Yup.object().shape({
              nombre: Yup.string().max(255).required('Debe definir el nombre del evento'),
              asunto: Yup.string().max(255).required('Debe definir el asunto del email')
            })}
            onSubmit={onSubmit}
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
                <CardContent>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.nombre && errors.nombre)}
                        fullWidth
                        helperText={touched.nombre && errors.nombre}
                        label="Nombre evento"
                        margin="normal"
                        name="nombre"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.nombre}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.fecha1 && errors.fecha1)}
                        fullWidth
                        helperText={touched.fecha1 && errors.fecha1}
                        InputProps={{
				            startAdornment: <InputAdornment position="start">Inicio</InputAdornment>,
				          }}
                        
                        margin="normal"
                        name="fecha1"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="datetime-local"
                        value={values.fecha1}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.fecha2 && errors.fecha2)}
                        fullWidth
                        helperText={touched.fecha2 && errors.fecha2}
                        InputProps={{
				            startAdornment: <InputAdornment position="start">Fin</InputAdornment>,
				          }}
                        margin="normal"
                        name="fecha2"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="datetime-local"
                        value={values.fecha2}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={2}>
                    	<IconButton edge="end" aria-label="calendar"
		                  onClick={()=>console.log("Ver horarios")}
		                >
		                	<Icon iconName="TimelineMatrixView" style={{transform: 'scale(1.3)'}}/>
		                </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.asunto && errors.asunto)}
                        fullWidth
                        helperText={touched.asunto && errors.asunto}
                        label="Asunto"
                        margin="normal"
                        name="asunto"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.asunto}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardContent>
                  <Editor editorState={editorState} setEditorState={setEditorState}/>
                </CardContent>
                <CardContent>
                	<Grid container>
	                  	<Grid xs={6}></Grid>
	                  	<Grid xs={6}>
		                  <Button variant="contained" fullWidth type="submit" color="primary">
		                    {"Agendar"}
		                  </Button>
		                </Grid>
		            </Grid>
                </CardContent>
              </form>
            )}
          </Formik>
        </Card>
      </Grid>
      
        
    </Grid>
  );
}

export default Calendar;