import React from 'react';
import Contenedor from '../contenedor';
import KPIWelcome from '../componentes/welcome/KPIWelcome';
import Bienvenida from '../componentes/welcome/Bienvenida';
import { connect } from 'react-redux';


const WelcomePage = (props) => {
  return ( 
    <Contenedor>
    	{props.bienvenida===null ? 
        <p>No disponible</p>
      :
        <>
          <Bienvenida bienvenida={props.bienvenida.welcome_message}>
            <KPIWelcome data={props.bienvenida} />
          </Bienvenida>

        </>
      }
      
    </Contenedor>
  );
}
const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
    procesos: estado.procesos,
    estado: estado,
    bienvenida: estado.bienvenida,
  }
}
const mapDispatchToProps = despachar => {
    return {
        actualizarUsuario: (usuario) => despachar({type: 'ACTUALIZAR_USUARIO',usuario: usuario}),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);