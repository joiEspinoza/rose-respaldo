import React from 'react';
import KPIContainer from './KPIContainer';
import MoneyIcon from '@material-ui/icons/Money';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';


const KPIWelcome = (props) => {
  const itemes = [
    {
      nombre:"Cantidad CV",
      cantidad:"10",
      icon:<MoneyIcon />,
    },
    {
      nombre:"Tiempo ahorrado estimado",
      cantidad:"20 h",
      icon:<AccessTimeIcon />,
    },
    {
      nombre:"Cantidad Procesos",
      cantidad:"3",
      icon:<GetAppIcon />,
    },
  ];
  const forma = {
    spacing:3,
    xs:12,
    sm:3,
  };

  return ( 
    <KPIContainer forma={forma} itemes={itemes} columnas={props.columnas} data={props.data}/>
  );
}


export default KPIWelcome;