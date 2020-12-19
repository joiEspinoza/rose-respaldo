import React, { useState, useEffect } from 'react';
import Navegacion from './componentes/Navegacion';
import Cambiador from './componentes/Cambiador';
import CambiadorPublico from './componentes/CambiadorPublico';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import obtenerEstadoUsuarioTest from './funciones/login/obtenerEstadoUsuarioTest';
//import { useHistory } from "react-router-dom";
import GlobalStyles from './componentes/GlobalStyles';
import axios from 'axios';
import {Helmet} from "react-helmet";
import data from './componentes/DataProcesos';
import './App.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const App = (props) => {
  //let history = useHistory();
  useEffect(()=>{
    obtenerEstadoUsuarioTest(props);
    props.cargarProcesos();
  },[]);
  

  return (
    <div>
      <Helmet>
          <meta charSet="utf-8" />
          <title>Rose</title>
      </Helmet>
      <GlobalStyles />
      <Casos usuario={props.usuario} privado={props.usuario !== null} actualizarUser={props.actualizarUser} />
      
      

    </div>
    
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
const cargarProcesos = () => {
  return {
    type: 'CARGAR_PROCESOS',
    newState: data,
  }
}

const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}

const mapDispatchToProps = despachar => {
    return {
        actualizarUser: (usuario) => despachar(actualizarUsuario(usuario)),
        cargarProcesos: () => despachar(cargarProcesos()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);