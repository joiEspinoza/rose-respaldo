import React from 'react';
import Contenedor from '../contenedor';
import AddProceso from '../componentes/AddProcess';




const AddProcess = (props) => {
  
  return (
    <Contenedor>
      <AddProceso usuario={props.usuario} />
    </Contenedor>
  );
}

export default AddProcess;