import React from 'react';
import { connect } from 'react-redux'

import KPIContainer from './KPIContainer';
import { Icon } from '@fluentui/react/lib/Icon';

const KPIWelcome = (props) => {
  const {
    proceso: processId,
    procesos: process,
  } = props

  const currentProcess = process.find(item => item.id === processId);
  let kpis = {}

  if (currentProcess)
    kpis = currentProcess.kpis
  
  const itemes = [
    {
      nombre:"Inferior",
      cantidad: kpis.low || 0,
      icon:<Icon style={{
        transform: 'scale(3.5)',
        color:"white",
      }} iconName={"UserWarning"}  />,
    },
    {
      nombre:"Normal",
      cantidad: kpis.medium || 0,
      icon:<Icon style={{
        transform: 'scale(3.5)',
        color:"white",
      }} iconName={"ReminderPerson"}  />,
    },
    {
      nombre:"Sobresaliente",
      cantidad: kpis.high || 0,
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


export default connect(state => state)(KPIWelcome);