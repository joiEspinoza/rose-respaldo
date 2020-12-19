import React, { useEffect, useState } from 'react';
import Contenedor from '../contenedor';
import KPIWelcome from '../componentes/welcome/KPIWelcome';
import Bienvenida from '../componentes/welcome/Bienvenida';
import { connect } from 'react-redux';
import axios from 'axios';

const WelcomePage = (props) => {
  const [data, setData] = useState({});
  const estado = props.usuario !== null;
  useEffect(()=>{
    if(estado){
      axios.get(`http://127.0.0.1:8000/selection/home/${props.usuario.correo}/`).
      then(res=>{console.log(res);setData(res.data);}).
      catch(err=>console.log(err));
    }
  },[]);
  return ( 
    <Contenedor>
    	{data==={} ? 
        <p>No disponible</p>
      :
        <>
          <KPIWelcome data={data} />
          <Bienvenida bienvenida={data.welcome_message}/>
        </>
      }
      
    </Contenedor>
  );
}
const mapStateToProps = estado => {
  return {
    usuario: estado.usuario,
  }
}
const mapDispatchToProps = despachar => {
    return {
        
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);