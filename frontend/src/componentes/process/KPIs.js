import React from 'react';
import KPIContainer from './KPIContainer';
import { Icon } from '@fluentui/react/lib/Icon';

const KPIWelcome = (props) => {
  const itemes = [
    {
      nombre:"Inferior",
      cantidad:"10",
      icon:<Icon style={{
        transform: 'scale(3.5)',
        color:"white",
      }} iconName={"UserWarning"}  />,
    },
    {
      nombre:"Normal",
      cantidad:"20",
      icon:<Icon style={{
        transform: 'scale(3.5)',
        color:"white",
      }} iconName={"ReminderPerson"}  />,
    },
    {
      nombre:"Sobresaliente",
      cantidad:"3",
      icon:<Icon style={{
        transform: 'scale(3.5)',
        color:"white",
      }} iconName={"PartyLeader"}  />,
    },
  ];
  const forma = {
    spacing:3,
    xs:12,
    sm:3,
  };

  return ( 
    <KPIContainer forma={forma} nombre={props.nombre} fecha={props.fecha} itemes={itemes} columnas={props.columnas} data={props.data}/>
  );
}


export default KPIWelcome;