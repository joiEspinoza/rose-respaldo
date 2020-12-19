import React from 'react';
import KPIContainer from './KPIContainer';
import MoneyIcon from '@material-ui/icons/Money';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import GetAppIcon from '@material-ui/icons/GetApp';


const KPIWelcome = (props) => {
  const itemes = [
    {
      nombre:"Cantidad CV",
      cantidad:props.data.resumes_ct,
      icon:<MoneyIcon/>,
    },
    {
      nombre:"Tiempo ahorrado estimado",
      cantidad:`${props.data.saved_time_min} h`,
      icon:<AccessTimeIcon />,
    },
    {
      nombre:"Cantidad Procesos",
      cantidad:props.data.selections_ct,
      icon:<GetAppIcon />,
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