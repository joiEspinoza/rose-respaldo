import React from 'react';
import Dialogo from '../Dialogo';

const Calendar = (props) => {
  const { setOpen, open } = props;
  return (
  	<Dialogo setOpen={setOpen} open={open} titulo={"Agendar reunión con Candidato"} >
  		{"Hola"}
  	</Dialogo>
  );
}

export default Calendar;