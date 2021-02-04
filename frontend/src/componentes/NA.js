import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Icon } from '@fluentui/react/lib/Icon';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  
  card: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.grisoscuro,
  },
  root: {
    height: '100%',
    borderRadius: theme.spacing(4),
    backgroundColor: theme.palette.secondary.light,

  },
  icono: {
    paddingTop: theme.spacing(6),
  },
}));

const NAHistoric = ({mensaje,columnas,children}) => {
  return (
      <NATarjeta extendida={false} mensaje={mensaje} sizes={{mensaje:"h6"}}>
        <Grid container spacing={3}>
          <Grid item xs={5} md={4} sm={4} lg={3}>
            <NAKPI2 />
          </Grid>
          <Grid item xs={2} md={4} sm={4} lg={6}></Grid>
          <Grid item xs={5} md={4} sm={4} lg={3}>
            {children}
          </Grid>
        </Grid>
        <NATabla  columnas={columnas} />
      </NATarjeta>
  );
}
const NAHelp = ({mensaje}) => {
  return (
      <NATarjeta mensaje={mensaje}>
        <Typography variant="h1">
          <Skeleton />
        </Typography>
      </NATarjeta>
  );
}

const NAKPI = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={8}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ color: "white"}}
            >
              <Skeleton/>
            </Typography>
            <Typography
              color="textPrimary"
              variant="h1"
              style={{ color: "white"}}
            >
              <Skeleton/>
            </Typography>
          </Grid>
          <Grid item xs={4} >
            <Skeleton animation="wave" height="100%"/>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const NAKPI2 = (props) => {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={8}>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
              style={{ color: "white"}}
            >
              <Skeleton/>
            </Typography>
          </Grid>
          <Grid item xs={4} >
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ color: "white"}}
            >
              <Skeleton/>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const NADefaultChildrenKPI = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <NAKPI />
      </Grid>
      <Grid item xs={12} sm={4}>
        <NAKPI />
      </Grid>
      <Grid item xs={12} sm={4}>
        <NAKPI />
      </Grid>
    </Grid>
  );
}


const NATarjeta = ({ className, children=<NADefaultChildrenKPI/>, sizes = {mensaje:"h2",esqueleto1:"h1",esqueleto2:"h5"}, mensaje = "No disponible actualmente", extendida=true }) => {
  const classes = useStyles();

  return (
    <Grid container >
      <Grid item xs={12}>
        <Card
          className={classes.card}
        >
          <CardContent>
            <Typography
              align="center"
              gutterBottom
              variant={sizes.mensaje}
            >
              {mensaje}
            </Typography>
          </CardContent>
          {extendida ?
            <>            
              <CardContent>
                {children}
              </CardContent>
              <CardContent>
                <Typography
                  align="center"
                  color="textPrimary"
                  variant={sizes.esqueleto1}
                >
                  <Skeleton/>
                </Typography>
              </CardContent>
            </>
          :
            <CardContent>
              {children}
            </CardContent>
          }
        </Card>
      </Grid>
    </Grid>
  );
};

const NATabla = ({ className, columnas }) => {
  const [limite, definirLimite] = useState(1);
  const [pagina, definirPagina] = useState(0);

  const theme = useTheme();
  const cambiarLimite = (evento) => {
    definirLimite(evento.target.value);
  };

  return (
    <Card
    >
      
          <Table>
            <TableHead>
              <TableRow>
                
                {Object.keys(columnas).map(nombreColumna=>(
                  <TableCell>
                    {columnas[nombreColumna].titulo}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
              >
                {Object.keys(columnas).map((nombreColumna, index) => (
                  <TableCell key={index}>
                    {typeof columnas[nombreColumna].href === 'undefined' ?
                      <>{nombreColumna === "status" ?
                        
                          <Typography
                            fontWeight= {400}
                            variant={columnas[nombreColumna].tamano}
                            style={{ color:"white", backgroundColor: theme.palette.primary.main }}

                          >
                            <Box fontWeight="fontWeightBold">
                              <Skeleton />
                            </Box>
                          </Typography>
                      :
                        <>{nombreColumna === "created_at"?
                          <Typography
                            color={columnas[nombreColumna].color}
                            variant={columnas[nombreColumna].tamano}
                          >
                            <Skeleton />
                          </Typography>
                        :
                          <Typography
                            color={columnas[nombreColumna].color}
                            variant={columnas[nombreColumna].tamano}
                          >
                            <Skeleton />
                          </Typography>
                        }</>
                      }</>
                      
                    :
                      <Typography
                        color={columnas[nombreColumna].color}
                        variant={columnas[nombreColumna].tamano}
                        style={{ textDecoration: 'none' }}
                        
                      >
                        {nombreColumna!== 'edit' ? 
                          <Skeleton animation="wave"/>
                        :
                          <Icon iconName={"EditNote"}  />
                        }
                      </Typography>
                    }
                  </TableCell>  
                ))}                  
              </TableRow>
            </TableBody>
          </Table>      
    </Card>
  );
};


export { NATarjeta, NATabla, NAHelp, NAHistoric };