import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';
import { app, google, facebook } from './../firebase/firebase';



const Sociallogin = (props) => {
  let history = useHistory();

  useEffect(()=>{
    const social_auth = localStorage.getItem('social_auth');
    if (localStorage.social_auth && social_auth==="1"){
      autenticacion();
    }
  },[]);


  const autenticacionG = (evento) => {
    evento.preventDefault();
    localStorage.setItem('social_auth', "1");
    app.auth().signInWithRedirect(google)
    .then(resp => console.log(resp)).catch(err => console.log(err));
  };

  const autenticacionF = (evento) => {
    evento.preventDefault();
    localStorage.setItem('social_auth', "1");
    app.auth().signInWithRedirect(facebook)
    .then(resp => console.log(resp)).catch(err => console.log(err));
  };

  const autenticacion = () => {
    app.auth().getRedirectResult()
    .then(resp => handleThen(resp)).catch(err => handleError(err));
  };


  const handleError = (error) => {
    console.log("Error");
    console.log(error);
  };
  const handleThen = (respuesta) => {
    localStorage.removeItem('social_auth');
    history.push("/");
  };
  return (
    <div className="Sociallogin">
      <Button variant="contained" color="primary" onClick={autenticacionG} >Acceder con Google</Button><br/><br/>
      {/*<Button variant="contained" color="primary" onClick={autenticacionF} >Acceder con Facebook</Button>*/}
    </div>
  );
}

export default Sociallogin;
