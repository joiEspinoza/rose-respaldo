import React from 'react';
import KPIContainer from './KPIContainer';
import { Icon } from '@fluentui/react/lib/Icon';

const KPIWelcome = (props) => {
  const itemes = [
    {
      nombre:"Cantidad de CVs",
      cantidad:props.data.resumes_ct,
      icon:<Icon style={{
      transform: 'scale(7)',
      color:"white", // Tune it
    }} iconName={"TextDocumentShared"}  />,
    },
    {
      nombre:"Tiempo ahorrado",
      cantidad:props.data.saved_time_min,
      icon:<Icon style={{
      transform: 'scale(7)',
      color:"white", // Tune it
    }} iconName={"Clock"}  />,
    },
    {
      nombre:"Procesos completados",
      cantidad:props.data.selections_ct,
      icon:<Icon style={{
      transform: 'scale(7)',
      color:"white", // Tune it
    }} iconName={"Contact"}  />,
    },
  ];
  const forma = {
    spacing:3,
    xs:12,
    sm:4,
  };

  return ( 
    <KPIContainer forma={forma} itemes={itemes}/>
  );
}


export default KPIWelcome;