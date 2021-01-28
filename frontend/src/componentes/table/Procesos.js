import React, { useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Paginacion, TituloColumnaSeleccionador, CeldaColumnaSeleccionador, FilaFiltros } from './Elementos';
import { useTheme } from '@material-ui/core/styles';
import { TablaEstilo } from '../../estilo/Estilo';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));
const Tabla = ({ className, filtros, anadirFiltro, configuracion, eliminarFiltro, data, idSeleccionados, definirIdSeleccionados, columnas, seleccionarProceso, ...rest }) => {
  
  const classes = useStyles();
  const theme = useTheme();
  
  const [limite, definirLimite] = useState(7);
  const [pagina, definirPagina] = useState(0);
  const [mostrar, setMostrar] = useState(false);
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
  let history = useHistory();
  return (
    <Card
      className={classes.root}
    >
      <TablaEstilo configuracion={configuracion}>
      
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
                  <TableCell onClick={()=>setMostrar(!mostrar)}>
                    {columnas[nombreColumna].titulo}
                  </TableCell>
                ))}
              </TableRow>
              {mostrar && <FilaFiltros filtros={filtros} anadirFiltro={anadirFiltro} eliminarFiltro={eliminarFiltro} mostrar={mostrar} setMostrar={setMostrar} col={Object.keys(columnas)}/>}
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
                        <>{nombreColumna === "status" ?
                          
                            <Typography
                              fontWeight= {400}
                              variant={columnas[nombreColumna].tamano}
                              style={{ color:"white", backgroundColor:elemento[nombreColumna] === "In progress" ? theme.palette.info.main : theme.palette.processdone,
                                  padding: theme.spacing(1), borderRadius:theme.spacing(1), }}

                            >
                              <Box fontWeight="fontWeightBold">
                                {elemento[nombreColumna]===undefined ? "No definido" : elemento[nombreColumna]}
                              </Box>
                            </Typography>
                        :
                          <>{nombreColumna === "created_at"?
                            <Typography
                              color={columnas[nombreColumna].color}
                              variant={columnas[nombreColumna].tamano}
                            >
                              {elemento[nombreColumna]===undefined ? "No definido" : elemento[nombreColumna].slice(0,10).concat(" a las ",elemento[nombreColumna].slice(11,16)," horas")}
                            </Typography>
                          :
                            <Typography
                              color={columnas[nombreColumna].color}
                              variant={columnas[nombreColumna].tamano}
                            >
                              {elemento[nombreColumna]===undefined ? "No definido" : elemento[nombreColumna]}
                            </Typography>
                          }</>
                        }</>
                        
                      :
                        <Typography
                          color={columnas[nombreColumna].color}
                          variant={columnas[nombreColumna].tamano}
                          component={RouterLink}
                          style={{ textDecoration: 'none' }}
                          onClick={()=>{seleccionarProceso(elemento.id);history.push(columnas[nombreColumna].href);}}
                          
                        >
                          {nombreColumna!== 'edit' ? elemento[nombreColumna]:
                            <Icon iconName={"EditNote"}  />
                          }
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
      </TablaEstilo>
    </Card>
  );
};

const seleccionarProceso = (newIndex) => {
  return {
    type: 'SELECCIONAR_PROCESO',
    newIndex: newIndex,
  }
}


const mapStateToProps = estado => {
  return {
    configuracion: estado.configuracion,
  }
}

const mapDispatchToProps = despachar => {
    return {
        seleccionarProceso: (newIndex) => despachar(seleccionarProceso(newIndex)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabla);