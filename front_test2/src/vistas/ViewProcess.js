import React, { useState } from 'react';
import Contenedor from '../contenedor';
import { connect } from 'react-redux';
import Calendar from '../componentes/process/Calendar';
import Mail from '../componentes/process/Mail';
import {
  Grid,
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Link,
  Button,
  Divider,
} from '@material-ui/core';
import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfTwoTone';
import KPIs from '../componentes/process/KPIs';
import Pdf from "react-to-pdf";



const ref = React.createRef();

const ViewProcess = (props) => {
  const candidatosProceso = props.procesos.filter(i=>i.id===props.proceso_viewprocess)[0].candidatos;
  const candidatoCV = candidatosProceso[props.candidato];
  const [openMail, setOpenMail] = React.useState(false);
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const columnas = {
    "name":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    //"profesion":{titulo:"Creado",color:"textPrimary",tamano:"body2",link:false, },
    //"universidad":{titulo:"Status",color:"textPrimary",tamano:"body2",link:false, },
    "mail":{titulo:"Below",color:"textPrimary",tamano:"caption",link:false, },
    //"ciudad":{titulo:"Normal",color:"textPrimary",tamano:"caption",link:false, },
  };
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const candidatosProcesoExcel = candidatosProceso.map(i=>({name:i.name,mail:i.mail}));
  console.log(candidatosProcesoExcel);
  return (
    <Contenedor>
      <Grid container>
        <Grid item xs={12}>
          <KPIs columnas={columnasExcel}
            data={candidatosProceso}
          />
        </Grid>
        <Grid item xs={12} onClick={()=>console.log(props.usuario)}>
          {"Hola"}
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={5}>
              <Lista 
                seleccionarCandidato={props.seleccionarCandidato}
                candidatos={candidatosProceso}
                setOpenMail={setOpenMail}
                setOpenCalendar={setOpenCalendar}
              />
            </Grid>
            <Grid item xs={7}>
              {/*<CV 
                candidato={candidatoCV}
              />*/}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Calendar setOpen={setOpenCalendar} open={openCalendar}/>
      <Mail setOpen={setOpenMail} open={openMail} usermail={props.usuario.correo} candidatemail={candidatoCV.email}/>
      {props.proceso_viewprocess}
      {props.candidato}
    </Contenedor>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover':{
      backgroundColor: theme.palette.primary.ligth,
    },
  }
}));

const Lista = (props) => {
  const classes = useStyles();
  return (
    <List
      component="nav"
      style={{paddingTop:30, maxHeight: 400, overflow: 'auto'}}
    >
    {props.candidatos.map((i,index)=>(
      <ListItem button >
        <div onClick={()=>{props.seleccionarCandidato(index);}}>
        <Grid container >
          <Grid item xs={7}>
            <Grid container spacing={2}>
              <Grid item xs={12} paddingTop={10}>
                <Typography variant="h6">
                  {i.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {i.mail}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {i.ciudad}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  {i.experiencia}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={1}>
            <Grid container>
              <Grid item xs={12}>
                <IconButton edge="end" aria-label="calendar"
                  onClick={()=>props.setOpenCalendar(true)}
                >
                  <CalendarTodayTwoToneIcon color="primary" />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <IconButton edge="end" aria-label="calendar"
                  onClick={()=>props.setOpenMail(true)}
                >
                  <MailTwoToneIcon color="primary" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        
        </div>
      </ListItem>
    ))}
    
    
    </List>
  );
}

const CV = (props) => {
  
  return (
    <div ref={ref}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2} >
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h6">
                {props.candidato.nombre}
              </Typography>
              <Typography variant="body1">
                {props.candidato.universidad}
              </Typography>
              <Typography variant="body1">
                {props.candidato.email}
              </Typography>
              <Typography variant="body1">
                {props.candidato.ciudad}
              </Typography>
              <Typography variant="body1">
                {props.candidato.numero}
              </Typography>
            </Grid>
            <Grid item xs={5} >
              <br/>
              <Typography variant="body1">
                {props.candidato.profesion}
              </Typography>
              <Typography variant="body1">
                {props.candidato.egreso}
              </Typography>
              <Typography variant="body1">
                {props.candidato.experiencia}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <Pdf targetRef={ref} filename="code-example.pdf">
                {({ toPdf }) => (
                  <IconButton edge="end" aria-label="pdf" onClick={toPdf}>
                    <PictureAsPdfTwoToneIcon color="primary" fontSize="large" />
                  </IconButton>
                )}
              </Pdf>
              
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} height="10px">
          <br/>
        </Grid>
        <Grid item xs={1}>
        </Grid>
        <Grid item xs={5}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Trabajado en:"}
              </Typography>
              <List>
                {props.candidato.trabajadoen.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Trabajado como:"}
              </Typography>
              <List>
                {props.candidato.trabajadocomo.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Skills:"}
              </Typography>
              <List>
                {props.candidato.skills.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Idiomas:"}
              </Typography>
              <List>
                {props.candidato.idiomas.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Certificaciones:"}
              </Typography>
              <List>
                {props.candidato.certificaciones.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>
        </Grid>
        <Grid item xs={1}>
        </Grid>
      </Grid>
    </div>
  );
}

const seleccionarCandidato = (newIndex) => {
  return {
    type: 'SELECCIONAR_CANDIDATO',
    newIndex: newIndex,
  }
}

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
    procesos: estado.procesos,
    proceso_viewprocess: estado.proceso_viewprocess,
    candidato: estado.candidato_viewprocess,
  }
}

const mapDispatchToProps = despachar => {
    return {
        seleccionarCandidato: (newIndex) => despachar(seleccionarCandidato(newIndex)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewProcess);