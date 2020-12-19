import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';


const Titulo = ({ }) => {
  return (
    <> 
    </>
  );
};

const Cuerpo = ({ }) => {
  return (
    <> 
    </>
  );
};

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


