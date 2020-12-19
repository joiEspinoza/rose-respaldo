import React, { useState, useEffect } from 'react';
//import { useHistory } from "react-router-dom";
import * as Msal from "msal";
import axios from 'axios';

const msalConfig = {
    auth: {
        clientId: 'd236c53d-05c9-41c5-aade-d26ed6bb6c6d'
    }
};

const msalInstance = new Msal.UserAgentApplication(msalConfig);

msalInstance.handleRedirectCallback((error, response) => {
    console.log(error, response);
    console.log("dentro");
});
var loginRequest = {
   scopes: ["Calendars.ReadWrite.Shared","email","Mail.Send","offline_access","openid","profile","User.Read"],
   redirectUri:"http://localhost:3000/login/microsoft",
};

var tokenRequest = {
    scopes: ["Calendars.ReadWrite.Shared","email","Mail.Send","offline_access","openid","profile","User.Read"],
    redirectUri:"http://localhost:3000/login/microsoft",
};

const ssoRequest = {
    loginHint: "clopez@myfuture.ai",
};

const loginPopup = (actualizarUser, history) => {
	msalInstance.loginPopup(loginRequest)
        .then(response => {
            console.log(response);
            var uid = response.account.accountIdentifier;
            var nombre = response.account.name;
            var correo = response.account.userName;
            var accessToken = acquireTokenSilent();
            var response = response;
            console.log(accessToken);
            axios.post("http://127.0.0.1:8000/social_auth/microsoft/",{
              "auth_token":accessToken,
            }).then(r=>{
              console.log(r);
              actualizarUser({
                uid: uid,
                nombre:nombre,
                correo: correo,
                accessToken: accessToken,
                response: response,
              });
              history.push("/");
            }).catch(er=>console.log(er));
            
            // handle response
        })
        .catch(err => {
            // handle error
        });
}

const ssoSilent = (props) => {
	msalInstance.ssoSilent(ssoRequest)
    .then(response => {
        // session silently established
    })
    .catch(error => {
        // handle error by invoking an interactive login method
        msalInstance.loginPopup(ssoRequest);
    });
}

const acquireTokenSilent = (props) => {
	msalInstance.acquireTokenSilent(tokenRequest)
    .then(response => {
        console.log("Acquire token",response)
        return response.accessToken;
    })
    .catch(err => {
        // could also check if err instance of InteractionRequiredAuthError if you can import the class.
        if (err.name === "InteractionRequiredAuthError") {
            return msalInstance.acquireTokenPopup(tokenRequest)
                .then(response => {
                    // get access token from response
                    // response.accessToken
                })
                .catch(err => {
                    // handle error
                });
        }
    });
}


const isMicrosoftLogged = (props) => {
  if (msalInstance.getAccount()) {
  	return msalInstance.getAccount();
  }else{
  	return false;
  }
}

const logout = (props) => {
	msalInstance.logout();
}

const Microsoft = (props) => {
  //let history = useHistory();
  useEffect(()=>{
    msalInstance.loginPopup(loginRequest)
    .then(response => {
        console.log("response",response);
    })
    .catch(err => {
        console.log("err",err);
    });
    console.log("afuera");
  },[]);

  return (
    <div>
      {props.children}
    </div>
    
  );
}

export { loginPopup, ssoSilent, acquireTokenSilent, isMicrosoftLogged, Microsoft, logout };