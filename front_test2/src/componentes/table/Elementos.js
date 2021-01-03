import React from 'react';
import {
  Checkbox,
  TableCell,
  TablePagination,
} from '@material-ui/core';


const CeldaColumnaSeleccionador = ({ seleccion, chequeado }) => {
  return (
    <TableCell padding="checkbox">
      <Checkbox
        checked={chequeado}
        onChange={seleccion}
        value="true"
      />
    </TableCell>
  );
};

const TituloColumnaSeleccionador = ({ chequeado, indeterminado, seleccionarTodos}) => {
  return (
    <TableCell padding="checkbox">
      <Checkbox
        checked={chequeado}
        color="primary"
        indeterminate={indeterminado}
        onChange={seleccionarTodos}
      />
    </TableCell>
  );
};


const Paginacion = ({ actual, cambiarPagina, cambiarLimite, pagina, limite}) => {
  return (
    <TablePagination
      component="div"
      count={actual}
      onChangePage={cambiarPagina}
      onChangeRowsPerPage={cambiarLimite}
      page={pagina}
      rowsPerPage={limite}
      rowsPerPageOptions={[7, 15, 50]}
    />
  );
};

export { Paginacion, TituloColumnaSeleccionador, CeldaColumnaSeleccionador };


