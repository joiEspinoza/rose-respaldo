import React, { useEffect } from 'react';
import Cambiador from './componentes/Cambiador';
import CambiadorPublico from './componentes/CambiadorPublico';
import { connect } from 'react-redux';
//import obtenerEstadoUsuarioTest from './funciones/login/obtenerEstadoUsuarioTest';
//import { useHistory } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import data from './componentes/DataProcesos';
import './App.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { initializeIcons } from '@uifabric/icons';
initializeIcons();


const App = (props) => {
  //let history = useHistory();
  useEffect(()=>{
    console.log("useEffect App 1");
    //obtenerEstadoUsuarioTest(props);
    if(props.usuario!==null){
      requestsProcesos(props.usuario,props.cargarProcesos).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      requestBienvenida(props.usuario.correo,props.cargarBienvenida).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      requestTutoriales(props.cargarTutoriales).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
    }
    
  },[props.usuario]);
  return (
    <>
      
      <CssBaseline />
      
      <Casos usuario={props.usuario} privado={props.usuario !== null} actualizarUser={props.actualizarUser} />
      
      

    </>
    
  );
}

const Casos = (props) => {
  const privado = [<Cambiador usuario={props.usuario} actualizarUser={props.actualizarUser}/>];
  const publico = [<CambiadorPublico usuario={props.usuario} actualizarUser={props.actualizarUser}/>];
  return (
    <>
      {props.privado && privado}
      {!props.privado && publico}
    </>
  );
}

const actualizarUsuario = (usuario) => {
  return {
    type: 'ACTUALIZAR_USUARIO',
    usuario: usuario,
  }
}
const cargarProcesos = (newState) => {
  return {
      type: 'CARGAR_PROCESOS',
      newState: newState,
    }  
}
const cargarBienvenida = (newState) => {
  return {
      type: 'CARGAR_BIENVENIDA',
      newState: newState,
    }  
}
const cargarTutoriales = (newState) => {
  return {
      type: 'CARGAR_TUTORIALES',
      newState: newState,
    }  
}

const requestsProcesos = (usuario, cargarProcesos) => {
    return new Promise((resolve, reject)=>{
      var state = data;
      axios.get(`http://127.0.0.1:8000/selection/list/${usuario.correo}/`)
      .then(response=>{
        console.log(response);
        state = response.data.data;
        state = state.map((i, index)=>{
          var salida = i;
          requestsCandidatosProceso(i.id).then(res=>{
            salida = Object.assign(i,{candidatos:res});
          }).catch(er=>console.log(er));
          return salida;
        });
        cargarProcesos(state);
        resolve(true);
      })
      .catch(error=>{
        console.log(error);
        cargarProcesos(state);
        reject(false);
      });
    });
}

const requestsCandidatosProceso = (idProceso) => {
    return new Promise((resolve, reject)=>{
      var candidatos;
      axios.get(`http://127.0.0.1:8000/selection/${idProceso}/candidates/`)
      .then(response=>{
        console.log(response);
        candidatos = response.data.data;
        resolve(candidatos);
      })
      .catch(error=>{
        console.log(error);
        reject(error);
      });
    });
}

const requestBienvenida = (correo, cargar) => {
    return new Promise((resolve, reject)=>{
      axios.get(`http://127.0.0.1:8000/selection/home/${correo}/`).then(response=>{
        console.log(response);
        cargar(response.data);

        resolve(true);
      })
      .catch(error=>{
        console.log(false);
        reject("bienvenida");
      });
    });
}

const requestTutoriales = (cargar) => {
    return new Promise((resolve, reject)=>{
      axios.get(`http://127.0.0.1:8000/selection/tutorials/`).then(response=>{
        console.log(response);
        cargar(response.data);
        resolve(true);
      })
      .catch(error=>{
        console.log(false);
        reject(error);
      });
    });
}


const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
    procesos: estado.procesos,
    estilo: estado.estilo,
  }
}

const mapDispatchToProps = despachar => {
    return {
        actualizarUser: (usuario) => despachar(actualizarUsuario(usuario)),
        cargarProcesos: (newState) => despachar(cargarProcesos(newState)),
        cargarBienvenida: (newState) => despachar(cargarBienvenida(newState)),
        cargarTutoriales: (newState) => despachar(cargarTutoriales(newState)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);