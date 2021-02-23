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

const Filtro = ({ variable, mostrar, filtros, anadirFiltro, eliminarFiltro }) => {
  const [texto, setTexto] = useState("");
  return (

    <>{mostrar ? <Grid container>
      <Grid item>
        <Grid container>
          <Grid item xs={8}>
            <TextField
              label={"Filtro"}
              variant="outlined"
              size="small"
              onChange={(e)=>setTexto(e.target.value)}
              value={texto}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              autoWidth={true}
              variant="contained"
              onClick={(e)=>{anadirFiltro({valor:texto,variable:variable});setTexto("");}}
              color="primary"
            >+
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{ paddingTop: "12px"}}>
        <Grid container>
          {filtros.map((i,index)=>(
            <Opcion valor={i.valor} indice={i.index} eliminarFiltro={eliminarFiltro} />
          ))}
        </Grid>
      </Grid>
    </Grid>
    :
      <></>
    }</>
  );
}

const Opcion = ({ valor, eliminarFiltro, indice }) => {
  
  return(
  <Grid item >
    <Badge color="secondary" as="button" badgeContent={"X"} color="primary"
      onClick={()=>eliminarFiltro(indice)}>
      <Button variant="contained" color="secondary">
        <Typography variant="caption" >{valor}</Typography>
      </Button>
    </Badge>
  </Grid>
  );
}
const FilaFiltros = ({ col, mostrar, setMostrar, filtros, anadirFiltro, eliminarFiltro }) => {
  
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
        <TableCell>{i==="edit" ?
          <></>
        :
          <Filtro variable={i} mostrar={mostrar} filtros={filtros.filter(f => f["variable"] === i)} anadirFiltro={anadirFiltro} eliminarFiltro={eliminarFiltro}/>
        }</TableCell>
        
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


