import React, { useState } from 'react';
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
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Procesos = ({ className, data, ...rest }) => {
  const classes = useStyles();
  const [idSeleccionados, definirIdSeleccionados] = useState([]);
  const [limite, definirLimite] = useState(10);
  const [pagina, definirPagina] = useState(0);

  const seleccionarTodos = (evento) => {
    let nuevosIdSeleccionados;

    if (evento.target.checked) {
      nuevosIdSeleccionados = data.map((customer) => customer.id);
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={idSeleccionados.length === data.length}
                    color="primary"
                    indeterminate={
                      idSeleccionados.length > 0
                      && idSeleccionados.length < data.length
                    }
                    onChange={seleccionarTodos}
                  />
                </TableCell>
                <TableCell>
                  Nombre
                </TableCell>
                <TableCell>
                  Creado
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Below
                </TableCell>
                <TableCell>
                  Normal
                </TableCell>
                <TableCell>
                  Outstanding
                </TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(limite*pagina, limite*(pagina+1)).map((customer) => (
                <TableRow
                  hover
                  key={customer.id}
                  selected={idSeleccionados.indexOf(customer.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={idSeleccionados.indexOf(customer.id) !== -1}
                      onChange={(evento) => seleccionarUno(evento, customer.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Avatar
                        className={classes.avatar}
                        src={customer.avatarUrl}
                      >
                        {getInitials(customer.nombre)}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {customer.nombre}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {moment(customer.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {customer.status}
                  </TableCell>
                  <TableCell>
                    {customer.below}
                  </TableCell>
                  <TableCell>
                    {customer.normal}
                  </TableCell>
                  <TableCell>
                    {customer.outstanding}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        
      <TablePagination
        component="div"
        count={data.length}
        onChangePage={cambiarPagina}
        onChangeRowsPerPage={cambiarLimite}
        page={pagina}
        rowsPerPage={limite}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default Procesos;