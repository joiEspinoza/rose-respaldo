import React from 'react';
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';
import { app } from './../firebase/firebase';

const Logout = (props) => {
  let history = useHistory();
  const handleClick = () => {
    app.auth().signOut()
    .then(resp => handleThen(resp)).catch(err => handleError(err));
  };
  const handleError = (error) => {
    console.log("Error");
    console.log(error);
  };
  const handleThen = (respuesta) => {
    console.log("Logout");
    console.log(respuesta);
    history.push("/");
  };
  return (
    <div className="Home">
      <br/> Logout<br/>
      <Button variant="contained" color="primary" onClick={handleClick}>
        ¿Desea terminar la sesión?
      </Button>
    </div>
  );
}


export default Logout;