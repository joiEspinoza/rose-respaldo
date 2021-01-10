import React from 'react';
import { useHistory } from "react-router-dom";
import { AppBar, Toolbar, Typography } from '@material-ui/core';


const Navegacion = (props) => {
  let history = useHistory();
  const handleClick = (ruta) => {
    history.push(ruta);
  }
  return(
    <div>
      <AppBar color="white" position="static" >
        <Toolbar>
          <Typography variant="h2" color="primary" onClick={() => handleClick("/")} >
           {"Rose"}
          </Typography>
          {/*<IconButton edge="start" color="primary" aria-label="menu" onClick={() => handleClick("Ruta")}>
            {"Ruta"}<BuildI/>
          </IconButton>*/}
        </Toolbar>
      </AppBar>
    </div>
  );
}




export default Navegacion;