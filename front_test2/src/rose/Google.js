import React from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { IconButton, Icon } from '@material-ui/core';
import icono from "../images/g.png";

const Google = (props) => {


  let history = useHistory();
  
  const errorGoogle=(response)=>{
    console.log(response);
  }

  const responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
    axios.post("http://127.0.0.1:8000/social_auth/google/",{
              "auth_token":response.tokenId,
            }).then(r=>{
              console.log(r);
              props.actualizarUser(Object.assign({},{
                uid:response.googleId,
                nombre: response.profileObj.familyName,
                correo: response.profileObj.email,
                tokenId: response.tokenId,
                response: response,
              }));
              response.reloadAuthResponse().then(i=>console.log("success on reload",i)).catch(i=>console.log("error",i));
              history.push("/");

            }).catch(r=>console.log(r));
              
    
    //response.tokenId envíar a backend
  }
  
  return (
    <div>
      <GoogleLogin
      clientId="374514394577-gn2bvmp9cjnsjn53aq0p575mdidpot47.apps.googleusercontent.com"
      buttonText=""
    	//accessType="offline"
    	//responseType="code"
      render={renderProps => (
        <IconButton aria-label="google" onClick={renderProps.onClick} disabled={renderProps.disabled}>
          <Icon>
            <img src={icono} height="100%" alt="g-login" width="100%"/>
          </Icon>  
        </IconButton>
      )}
    	prompt= "consent"
    	scope="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar"
      onSuccess={responseGoogle}
      onFailure={errorGoogle}
      cookiePolicy={'single_host_origin'}
      
      />
    </div>
  );
  
}


export default Google;