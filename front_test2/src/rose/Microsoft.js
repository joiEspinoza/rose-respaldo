import React from 'react';
import MicrosoftLogin from "react-microsoft-login";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { loginPopup, ssoSilent, acquireTokenSilent, isMicrosoftLogged, Microsoft, logout } from './Msal';

const MicroSoftOld = (props) => {
 let history = useHistory();
  const authHandler = (err, data) => {
    console.log(err, data);
  };
 	
  return (
    <MicrosoftLogin clientId={"d236c53d-05c9-41c5-aade-d26ed6bb6c6d"} authCallback={authHandler} redirectUri={"http://localhost:3000/login/microsoft"} graphScopes={
    	["Calendars.ReadWrite.Shared","email","Mail.Send","offline_access","openid","profile","User.Read"]}/>
  );
};

const MicroSoft = (props) => {
 let history = useHistory();
 const handleLogin = () => {
  loginPopup(props.actualizarUser, history);
  
 }
  return (
    <Button color="primary" onClick={handleLogin}>
      {'Microsoft Login'}
    </Button>
  );
};

export default MicroSoft;