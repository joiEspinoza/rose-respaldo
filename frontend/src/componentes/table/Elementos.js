import React, { useState } from 'react';
import {
  Checkbox,
  TableCell,
  TableRow,
  Grid,
  TablePagination,
  Badge,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
} from '@material-ui/core';

const Filtro = ({ variable, mostrar, filtros, anadirFiltro }) => {
  const f = ["a",10];
  const [texto, setTexto] = useState("");
  return (

    <>{mostrar ? <Grid container>
      <Grid item>
        <Grid container>
          <Grid item xs={8}>
            <TextField
              label={"Filtro"}
              variant="outlined"
              onChange={(e)=>setTexto(e.target.value)}
              value={texto}
            />
          </Grid>
          <Grid item xs={4}>
            <Select
              autoWidth={true}
              variant="outlined"
              onChange={(e)=>{anadirFiltro({tipo:e.target.value,valor:texto,variable:variable});setTexto("");}}
            >
              <MenuItem value={"="}>{"="}</MenuItem>
              <MenuItem value={">"}>{">"}</MenuItem>
              <MenuItem value={"<"}>{"<"}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {"Valores"}
        <Grid container>
          {f.map((i,index)=>(
            <Opcion valor={i} />
          ))}
          {filtros.map((i,index)=>(
            <Opcion valor={i.valor.concat(" | ",i.tipo)} />
          ))}
        </Grid>
      </Grid>
    </Grid>
    :
      <></>
    }</>
  );
}

const Opcion = ({ valor }) => {
  
  return(
  <Grid item >
    <Badge color="secondary" as="button" badgeContent={"X"} >
      <Button variant="caption" >
        <Typography variant="caption" >{valor}</Typography>
      </Button>
    </Badge>
  </Grid>
  );
}
const FilaFiltros = ({ col, mostrar, setMostrar, filtros, anadirFiltro }) => {
  
  return (
    <TableRow
      hover
      key={"filtros"}
    >
      <TableCell>
        <Checkbox
          checked={mostrar}
          onChange={()=>setMostrar(!mostrar)}
          value={mostrar}
        />
      </TableCell>
      {col.map((i,index)=>(
        <TableCell>
          {i}

          <Filtro variable={i} mostrar={mostrar} filtros={filtros.filter(f => f["variable"] === i)} anadirFiltro={anadirFiltro} />
        </TableCell>
      ))}
      
    </TableRow>
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

export { Paginacion, TituloColumnaSeleccionador, CeldaColumnaSeleccionador, FilaFiltros };


