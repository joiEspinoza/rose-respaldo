import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link as RouterLink } from 'react-router-dom';
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
import { Paginacion, TituloColumnaSeleccionador, CeldaColumnaSeleccionador } from './Elementos';
import getInitials from '../getInitials';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));
const Tabla = ({ className, data, ...rest }) => {
  const columnas = {
    "nombre":{titulo:"Nombre",color:"primary",tamano:"h6",link:true, href:"/ViewProcess"},
    "createdAt":{titulo:"Creado",color:"textPrimary",tamano:"body2",link:false, },
    "status":{titulo:"Status",color:"textPrimary",tamano:"body2",link:false, },
    "below":{titulo:"Below",color:"textPrimary",tamano:"caption",link:false, },
    "normal":{titulo:"Normal",color:"textPrimary",tamano:"caption",link:false, },
    "outstanding":{titulo:"Outstanding",color:"textPrimary",tamano:"caption",link:false, }
  };
  const classes = useStyles();
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const [limite, definirLimite] = useState(7);
  const [pagina, definirPagina] = useState(0);

  const seleccionarTodos = (evento) => {
    let nuevosIdSeleccionados;

    if (evento.target.checked) {
      nuevosIdSeleccionados = data.map((elemento) => elemento.id);
    } else {
      nuevosIdSeleccionados = [];
    }

    definirIdSeleccionados(nuevosIdSeleccionados);
  };

  const seleccionarUno = (evento, id) => {
    const indiceSeleccionado = idSeleccionados.indexOf(id);
    let nuevosIdSeleccionados = [];

    if (indiceSeleccionado === -1) {
      nuevosIdSeleccionados = nuevosIdSeleccionados.concat(idSeleccionados, id);
    } else if (indiceSeleccionado === 0) {
      nuevosIdSeleccionados = nuevosIdSeleccionados.concat(idSeleccionados.slice(1));
    } else if (indiceSeleccionado === idSeleccionados.length - 1) {
      nuevosIdSeleccionados = nuevosIdSeleccionados.concat(idSeleccionados.slice(0, -1));
    } else if (indiceSeleccionado > 0) {
      nuevosIdSeleccionados = nuevosIdSeleccionados.concat(
        idSeleccionados.slice(0, indiceSeleccionado),
        idSeleccionados.slice(indiceSeleccionado + 1)
      );
    }

    definirIdSeleccionados(nuevosIdSeleccionados);
  };

  const cambiarLimite = (evento) => {
    definirLimite(evento.target.value);
  };

  const cambiarPagina = (evento, nuevaPagina) => {
    definirPagina(nuevaPagina);
  };

  return (
    <Card
      className={classes.root}
    >
      
          <Table>
            <TableHead>
              <TableRow>
                <TituloColumnaSeleccionador 
                  chequeado={idSeleccionados.length === data.length}
                  indeterminado={
                      idSeleccionados.length > 0
                      && idSeleccionados.length < data.length
                    } 
                  seleccionarTodos={seleccionarTodos}
                />
                {Object.keys(columnas).map(nombreColumna=>(
                  <TableCell>
                    {columnas[nombreColumna].titulo}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(limite*pagina, limite*(pagina+1)).map((elemento) => (
                <TableRow
                  hover
                  key={elemento.id}
                  selected={idSeleccionados.indexOf(elemento.id) !== -1}
                >
                  <CeldaColumnaSeleccionador seleccion={(evento) => seleccionarUno(evento, elemento.id)} chequeado={idSeleccionados.indexOf(elemento.id) !== -1} />
                  {Object.keys(columnas).map(nombreColumna=>(
                    <TableCell>
                      {typeof columnas[nombreColumna].href === 'undefined' ?
                        <Typography
                          color={columnas[nombreColumna].color}
                          variant={columnas[nombreColumna].tamano}
                        >
                          {elemento[nombreColumna]}
                        </Typography>
                      :
                        <Typography
                          color={columnas[nombreColumna].color}
                          variant={columnas[nombreColumna].tamano}
                          component={RouterLink}
                          to={columnas[nombreColumna].href}
                        >
                          {elemento[nombreColumna]}
                        </Typography>
                      }
                    </TableCell>  
                  ))}                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
      <Paginacion actual={data.length} cambiarPagina={cambiarPagina}
        cambiarLimite={cambiarLimite} pagina={pagina} limite={limite}/>  
      
    </Card>
  );
};

export default Tabla;