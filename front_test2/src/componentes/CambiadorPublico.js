import React from 'react';
import { Switch, Route } from "react-router-dom";
import { AddProcess, EditProcess, Error, HelpIssue,
 HelpTutorials, Historic, Login, Process, ViewProcess,
  ViewProcessCalendar, ViewProcessMail, WelcomePage } from '../vistas/Vistas';


import LoginView from '../auth/LoginView';
import RegisterView from '../auth/RegisterView';
import MicroSoft from '../rose/Microsoft';



const Cambiador = (props) => {
  return (
    <Switch>
      <Route exact path={"/"} component={LoginView}/>
      <Route exact path={"/Registro"} component={RegisterView}/>
    </Switch>
  );
}


export default Cambiador;