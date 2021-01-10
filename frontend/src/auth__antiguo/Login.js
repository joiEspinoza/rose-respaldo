import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button, TextField } from '@material-ui/core';
import { app } from './../firebase/firebase';
import Sociallogin from './Sociallogin';


const Login = (props) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  let history = useHistory();

  const autenticacion = (evento) => {
    evento.preventDefault();
    app.auth().signInWithEmailAndPassword(usuario, contrasena)
    .then(resp => handleThen(resp)).catch(err => handleError(err));
  };

  const handleError = (error) => {
    console.log("Error");
    console.log(error);
  };
  const handleThen = (respuesta) => {
    history.push("/");
  };
  return (
    <div className="Auth">
      <br/><br/>
      <TextField label="Usuario" variant="outlined"
      name="usuario"
      value = {usuario}
      onChange={(e) => setUsuario(e.target.value)}/><br/>
      <TextField type="password" label="Contraseña" variant="outlined"
      name="contrasena"
      value = {contrasena}
      onChange={(e) => setContrasena(e.target.value)}/><br/>
      <Button onClick={autenticacion}>Inicio de Sesión Normal</Button><br/><br/>
      <Sociallogin/>
    </div>
  );
}


export default Login;
