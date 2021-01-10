import React from 'react';
import { Switch, Route } from "react-router-dom";
import Juego from '../juego/Juego';
import { Login, Logout, Registration } from '../auth/Auth';
import Home from './Home';
import MicroSoft from './rose/Microsoft';

const Cambiador = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/Juego" component={Juego}/>
      <Route exact path={"/Registro"} component={Registration}/>
      <Route exact path={"/Login"} component={Login}/>
      <Route exact path={"/Logout"} component={Logout}/>
      <Route exact path={"/login/microsoft"} component={MicroSoft}/>
    </Switch>
  );
}


export default Cambiador;