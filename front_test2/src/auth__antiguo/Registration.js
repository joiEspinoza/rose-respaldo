import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { app } from './../firebase/firebase';
import Sociallogin from './Sociallogin';
import { Button, TextField } from '@material-ui/core';





const Registration = (props) => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  let history = useHistory();

  const registro = (evento) => {
    evento.preventDefault();
    app.auth().createUserWithEmailAndPassword(usuario, contrasena)
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
      <div>
        <TextField label="Usuario" variant="outlined"
        name="usuario"
        value = {usuario}
        onChange={(e) => setUsuario(e.target.value)}/><br/>
        <TextField type="password" label="Contraseña" variant="outlined"
        name="contrasena"
        value = {contrasena}
        onChange={(e) => setContrasena(e.target.value)}/><br/>
        <Button onClick={registro}>Registrarse</Button><br/><br/>
      </div>
      <div>
        <Sociallogin/>
      </div>
    </div>
  );
}

export default Registration;
