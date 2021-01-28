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
import AWS from 'aws-sdk';
initializeIcons();

AWS.config.update({
  region : 'us-east-2',
  accessKeyId: 'AKIA5XKDKZ4KRSBLKVGI',
  secretAccessKey: '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',
});

const s3 = new AWS.S3({
 accessKeyId: 'AKIA5XKDKZ4KRSBLKVGI',
 secretAccessKey: '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',
 Bucket: 'rosev0',
 region : 'us-east-2',
});

console.log("AWS",AWS);


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
      requestConfiguracion(props.usuario.correo,props.cargarConfiguracion).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      requestTutoriales(props.cargarTutoriales).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      requestEventos(props.usuario.correo,props.usuario.token,props.cargarEventos).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      requestHistorico(props.usuario.correo,props.cargarHistorico).then(response=>{
        console.log("Respuesta verdadera",response);
      }).catch(e=>console.log(e));
      obtenerLogo(props.usuario.correo,props.cargarLogo).then(response=>{
        console.log("Respuesta verdadera logo",response);
      }).catch(e=>console.log("error logo",e));
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

const cargarEventos = (newState) => {
  return {
      type: 'CARGAR_EVENTOS',
      newState: newState,
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
const cargarConfiguracion = (newState) => {
  return {
      type: 'CARGAR_CONFIGURACION',
      newState: newState,
    }  
}
const cargarHistorico = (newState) => {
  return {
      type: 'CARGAR_HISTORICO',
      newState: newState,
    }  
}
const cargarTutoriales = (newState) => {
  return {
      type: 'CARGAR_TUTORIALES',
      newState: newState,
    }  
}
const cargarLogo = (newState) => {
  return {
      type: 'CARGAR_LOGO',
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

const requestHistorico = (correo, cargar) => {
    return new Promise((resolve, reject)=>{
      axios.get(`http://127.0.0.1:8000/selection​/${correo}​/candidates​/`).then(response=>{
        console.log(response);
        cargar(response.data);

        resolve(true);
      })
      .catch(error=>{
        console.log(false);
        reject("No se pudo cargar historico");
      });
    });
}

const requestEventos = (correo, token, cargar) => {
    return new Promise((resolve, reject)=>{
      axios.get(`http://127.0.0.1:8000/selection/events/${encodeURIComponent(correo)}/${encodeURIComponent(token)}`).then(response=>{
        console.log(response);
        cargar(response.data);

        resolve(true);
      })
      .catch(error=>{
        console.log(false);
        reject("No se pudo cargar eventos");
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

const requestConfiguracion = (correo, cargar) => {
    return new Promise((resolve, reject)=>{
      axios.get(`http://127.0.0.1:8000/selection/config/${correo}/`).then(response=>{
        console.log(response);
        cargar(response.data);

        resolve(true);
      })
      .catch(error=>{
        console.log(false);
        reject("config");
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

const obtenerLogo = (correo, cargar) => {
  console.log("obtlogo",correo);
  var email_cambiado = correo.replace("@","_");
  console.log(email_cambiado);
  var ruta = email_cambiado+'/icono';
  return new Promise((resolve, reject)=>{
    //s3.getObject({Key: ruta, Bucket:'rosev0'}, function(err, data) {
    s3.listObjects({Prefix: ruta, Bucket:'rosev0'}, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }else{
        console.log(data);
        resolve(data);
      }
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
        cargarConfiguracion: (newState) => despachar(cargarConfiguracion(newState)),
        cargarTutoriales: (newState) => despachar(cargarTutoriales(newState)),
        cargarEventos: (newState) => despachar(cargarEventos(newState)),
        cargarHistorico: (newState) => despachar(cargarHistorico(newState)),
        cargarLogo: (newState) => despachar(cargarLogo(newState)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);