import React, { useState } from 'react';
import Dialogo from '../Dialogo';
import Editor from '../Editor';
import { Grid, Container, Button, makeStyles, Card, CardContent, TextField } from '@material-ui/core';
import { EditorState } from 'draft-js';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Mail = (props) => {
  const { setOpen, open, user, candidatemail, token } = props;
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  return (
    <Dialogo setOpen={setOpen} open={open} titulo={"Nuevo Mensaje"} >
    	<Formulario user={user} candidatemail={candidatemail} token={token} />
  	</Dialogo>
  );
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

const Formulario = (props) => {
  const [editorState, setEditorState] =useState(EditorState.createEmpty());
  const html = convertToHTML(editorState.getCurrentContent());
  const classes = useStyles();
  const history = useHistory();
  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.card}>
          <Formik
            initialValues={{
              para: props.candidatemail,
              cc: '',
              asunto: '',
            }}
            validationSchema={Yup.object().shape({
              para: Yup.string().email('Debe ser un email válido').max(255).required('El email es requirido'),
              cc: Yup.string().email('Debe ser un email válido').max(255),
              asunto: Yup.string().max(255).required('Debe definir el asunto del email')
            })}
            onSubmit={(values, actions) => {
              const datam = {
                type:"mail",
                user:props.user.correo,
                info:{
                  "to":[values.para],
                  "cc":[values.cc],
                  "subject":values.asunto,
                  "content":html
                },
              };
              const datag = {
                type:"mail",
                user:props.user.correo,
                info:{
                  "sender":props.user.correo,
                  "to":values.para,
                  "cc":values.cc,
                  "subject":values.asunto,
                  "message_text":html
                },
              };
              const data = props.user.type === "google" ? datag : datam;
              console.log(data);
              axios.post(`https://rosev0-dev-api.myfuture.ai/selection/sendmail/${props.user.token}`,data).then(r=>{
                console.log(r);
                history.push('/');
              }).catch(r=>{
                console.log(r);
              });        
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
                <CardContent>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.para && errors.para)}
                        fullWidth
                        helperText={touched.para && errors.para}
                        label="Destinatario"
                        margin="normal"
                        name="para"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.para}
                        variant="outlined"
                      />
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
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.cc && errors.cc)}
                        fullWidth
                        helperText={touched.cc && errors.cc}
                        label="Con copia"
                        margin="normal"
                        name="cc"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="email"
                        value={values.cc}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                <CardContent>
                  <Editor editorState={editorState} setEditorState={setEditorState}/>
                </CardContent>
                <CardContent>
                  <Button variant="contained" type="submit" color="primary">
                    {"Enviar mail"}
                  </Button>
                </CardContent>
              </form>
            )}
          </Formik>
        </Card>
      </Grid>
      
        
    </Grid>
  );
}

export default Mail;