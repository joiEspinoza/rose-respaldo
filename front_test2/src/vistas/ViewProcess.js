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
            <Grid item xs={7} onClick={()=>console.log(candidatoCV)}>
              hola
              <CV 
                candidato={candidatoCV}
              />
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
                  {i.info.data.location[0]}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">
                  Exp: {i.info.data.exp}
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
                {props.candidato.name}
              </Typography>
              <Typography variant="body1">
                {props.candidato.info.data.college.length > 0 && props.candidato.info.data.college[0]}
              </Typography>
              <Typography variant="body1">
                {props.candidato.mail}
              </Typography>
              <Typography variant="body1">
                {props.candidato.info.data.location.length > 0 && props.candidato.info.data.location[0]}
              </Typography>
              <Typography variant="body1">
                {props.candidato.info.data.phone.length > 0 && props.candidato.info.data.phone[0]}
              </Typography>
            </Grid>
            <Grid item xs={5} >
              <br/>
              
              <Typography variant="body1">
                {props.candidato.info.data.graduation.length > 0 && props.candidato.info.data.graduation[0]}
              </Typography>
              <Typography variant="body1">
                {props.candidato.info.data.exp}
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
                {props.candidato.info.data.companies.length > 0 && props.candidato.info.data.companies.map(i=>(
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
                {props.candidato.info.data.designation.length > 0 && props.candidato.info.data.designation.map(i=>(
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
                {props.candidato.info.data.skills.length > 0 && props.candidato.info.data.skills.map(i=>(
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
                {props.candidato.info.data.idioms.length > 0 && props.candidato.info.data.idioms.map(i=>(
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
                {props.candidato.info.data.certficiations.length > 0 && props.candidato.info.data.certficiations.map(i=>(
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