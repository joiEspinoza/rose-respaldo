import React from 'react';
import Contenedor from '../contenedor';
import { connect } from 'react-redux';
import Calendar from '../componentes/process/Calendar';
import Mail from '../componentes/process/Mail';
import {
  Grid,
  Typography,
  makeStyles,
  List,
  ListItem,
  IconButton,
} from '@material-ui/core';
import KPIs from '../componentes/process/KPIs';
import Pdf from "react-to-pdf";
import { useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CalendarTodayTwoToneIcon from '@material-ui/icons/CalendarTodayTwoTone';
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfTwoTone';


const ref = React.createRef();

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    borderColor: theme.palette.grisoscuro,
    borderWidth: theme.spacing(1),
  },
  list: {
    height: '70vh',
    borderColor: theme.palette.grisoscuro,
    borderWidth: theme.spacing(1),
    overflowY: 'scroll',
  },
  item: {
    minWidth: '100%'
  }
}));

const ViewProcess = ({ usuario, procesos, proceso, candidato, seleccionarCandidato }) => {
  const render = procesos.filter(i=>i.id===proceso)[0].candidatos !== undefined;
  return(
    <>{render ?
      <Contenido usuario={usuario} procesos={procesos} proceso={proceso} candidato={candidato} seleccionarCandidato={seleccionarCandidato}/>
    :
      <Contenedor>{"Error"}</Contenedor>   
    }</>
  );
}

const Contenido = (props) => {
  const currentProcess = props.procesos.find(proc => proc.id === props.proceso)
  const candidatosProceso = currentProcess.candidatos;
  const candidatoCV = candidatosProceso[props.candidato];
  const [openMail, setOpenMail] = React.useState(false);
  const [openCalendar, setOpenCalendar] = React.useState(false);
  const columnas = {
    "name":{titulo:"Nombre",color:"primary",tamano:"h6",link:false},
    //"profesion":{titulo:"Creado",color:"textPrimary",tamano:"body2",link:false, },
    //"universidad":{titulo:"Status",color:"textPrimary",tamano:"body2",link:false, },
    "mail":{titulo:"Email",color:"textPrimary",tamano:"caption",link:false, },
    //"ciudad":{titulo:"Normal",color:"textPrimary",tamano:"caption",link:false, },
  };
  const columnasExcel = Object.keys(columnas).map(col => ({label:columnas[col].titulo,value:col}));
  const candidatosProcesoExcel = candidatosProceso.map(i=>({name:i.name,mail:i.mail}));
  return (
    <Contenedor>
      <Grid container>
        <Grid item xs={12}>
          <KPIs columnas={columnasExcel}
            data={candidatosProceso}
            nombre={currentProcess.name}
            fecha={currentProcess.created_at}
          />
        </Grid>
        <Grid item xs={12}><br/></Grid>
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
              <CV 
                candidato={candidatoCV}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Calendar setOpen={setOpenCalendar} open={openCalendar}/>
      <Mail setOpen={setOpenMail} open={openMail} user={props.usuario} candidatemail={candidatoCV.mail} token={props.usuario.token}/>
      {props.proceso}
      {props.candidato}
      {props.usuario.correo}
      {candidatoCV.mail}
    </Contenedor>
  );
}


const Lista = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <List
      component="nav"
      className={classes.list}
    >
      {props.candidatos.map((i, index) => (
        <ListItem button key={index}>
          <Card className={classes.item}>
            <CardContent>
              <div onClick={()=>{props.seleccionarCandidato(index);}}>
                <Grid container >
                  <Grid item xs={7}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} paddingTop={10}>
                        <Typography variant="h4" style={{ color:theme.palette.primary.main }}>
                          {i.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" style={{ color:theme.palette.grisoscuro }}>
                          {i.mail}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1" style={{ color:theme.palette.grisoscuro }}>
                          {i.info.data.degree ? <>Titulo:{i.info.data.degree[0]}</>
                            :<>{"No disponible"}</>}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" style={{ color:theme.palette.grisoscuro }}>
                          Exp: {i.info.data.exp} años
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
            </CardContent>
          </Card>
        </ListItem>
      ))}
    </List>
  );
}

const CV = (props) => {
  const pr = props.candidato.info.data;
  const theme = useTheme();
  const classes = useStyles();
  return (
    <div ref={ref}>
      <Grid container className={classes.root}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <Typography variant="h4" style={{ color: theme.palette.primary.main }}>
            {props.candidato.name}
          </Typography>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} >
            <Grid item xs={1}>
            </Grid>
            <Grid item xs={5}>
              
              <Typography variant="body1">
                {"Correo: "}{props.candidato.mail}
              </Typography>
              {pr.phone.length > 0 && <Typography variant="body1">
                {"Teléfono: "}{pr.phone.length > 0 && pr.phone[0]}
              </Typography>}
              {pr.degree.length > 0 && <Typography variant="body1">
                {"Título: "}{pr.degree.length > 0 && pr.degree[0]}
              </Typography>}
              
              
              
              
            </Grid>
            <Grid item xs={5} >
              <br/>
              {pr.college.length > 0 && <Typography variant="body1">
                {"Estudió en: "}{pr.college.length > 0 && pr.college[0]}
              </Typography>}
              {pr.graduation.length > 0 && <Typography variant="body1">
                {"Egreso: "}{pr.graduation.length > 0 && pr.graduation[0]}
              </Typography>}
              <Typography>
                {"Experiencia: "}{pr.exp}
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
        <Grid item xs={12}><br/></Grid>
        <Grid item xs={1}></Grid>
        {pr.skills && <Grid item xs={10} >
          <Typography variant={"h6"}>
            {"Skills:"}
          </Typography>
          <Grid container spacing={1}>
            {pr.skills.length > 0 && pr.skills.map(i=>(
              <Grid item >
                <Typography variant={"body2"}>
                  {i}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>}
        <Grid item xs={1}></Grid>
        <Grid item xs={12}><br/></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
          <Grid container>
            {pr.companies &&<Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Empresas donde ha trabajado:"}
              </Typography>
              <List>
                {pr.companies.length > 0 && pr.companies.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>}
            {pr.idioms &&<Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Idiomas:"}
              </Typography>
              <List>
                {pr.idioms.length > 0 && pr.idioms.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>}
          </Grid>
        </Grid>
        <Grid item xs={5}>
            {pr.designation && <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Trabajado como:"}
              </Typography>
              <List>
                {pr.designation.length > 0 && pr.designation.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>}
            
            {pr.certifications && <Grid item xs={12}>
              <Typography variant={"subtitle2"}>
                {"Certificaciones:"}
              </Typography>
              <List>
                {pr.certifications.length > 0 && pr.certifications.map(i=>(
                  <ListItem>
                    <Typography variant={"caption"}>
                      {i}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Grid>}
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
    proceso: estado.proceso,
    candidato: estado.candidato_viewprocess,
  }
}

const mapDispatchToProps = despachar => {
    return {
        seleccionarCandidato: (newIndex) => despachar(seleccionarCandidato(newIndex)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewProcess);