import React from 'react';
import { Switch, Route } from "react-router-dom";
import { AddProcess, EditProcess, Error, Help,
 HelpTutorials, Historic, Login, Process, ViewProcess,
  ViewProcessCalendar, ViewProcessMail, WelcomePage } from '../vistas/Vistas';


import LoginView from '../auth/LoginView';
import MicroSoft from '../rose/Microsoft';

import AccountView from './account';


const Cambiador = (props) => {
  return (
    <Switch>
      <Route exact path={"/Perfil"} component={AccountView}/>

      <Route exact path={"/AddProcess"} component={AddProcess}/>
      <Route exact path={"/EditProcess"} component={EditProcess}/>
      <Route exact path={"/Error"} component={Error}/>
      <Route exact path={"/Ayuda"} component={Help}/>
      <Route exact path={"/HelpTutorials"} component={HelpTutorials}/>
      <Route exact path={"/Historic"} component={Historic}/>
      <Route exact path={"/Logi"} component={Login}/>
      <Route exact path={"/Process"} component={Process}/>
      <Route exact path={"/ViewProcess"} component={ViewProcess}/>
      <Route exact path={"/ViewProcessCalendar"} component={ViewProcessCalendar}/>
      <Route exact path={"/ViewProcessMail"} component={ViewProcessMail}/>
      <Route exact path={"/"} component={WelcomePage}/>
      <Route exact path={"/WelcomePage"} component={WelcomePage}/>
    </Switch>
  );
}


export default Cambiador;