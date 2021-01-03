import React from 'react';
import { Switch, Route } from "react-router-dom";

import LoginView from '../auth/LoginView';
import RegisterView from '../auth/RegisterView';



const Cambiador = (props) => {
  return (
    <Switch>
      <Route exact path={"/"} component={LoginView}/>
      <Route exact path={"/Registro"} component={RegisterView}/>
    </Switch>
  );
}


export default Cambiador;