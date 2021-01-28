import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import paleta from './Paleta';
import tipografia, { tablas as tipografiatablas } from './Tipografia';
import tipografiaresponsiva from './TipografiaResponsiva';
import puntos from './Breakpoints';
import { connect } from 'react-redux';



const space = [3, 4, 8, 16, 32, 64, 72, 96, 120, 148, 184];
const tipograf = Object.assign({},tipografia,tipografiaresponsiva);

const theme = (configuracion) => {
  var colores = paleta;
  if(configuracion!==null){
    if(configuracion.primary_color!==undefined){
      colores = Object.assign({},colores,{
        primary: {main: configuracion.primary_color},
        roseclaro:'#E6E6E6',
        processdone:configuracion.primary_color,
        background: {
          default: '#E6E6E6'
        },
      });
    }
    if(configuracion.secondary_color!==undefined ){
      colores = Object.assign({},colores,{
        secondary: {main: configuracion.secondary_color},
        info: {main: configuracion.secondary_color},
        roseclaro:'#E6E6E6',
        processdone:configuracion.primary_color,
        background: {
          default: '#E6E6E6'
        },
      });
    }
  }
  return createMuiTheme({
    palette: colores,
    typography: tipograf,
    breakpoints: puntos,
    spacing: space,
    overrides: {
      //MuiCssBaseline styles
      MuiCssBaseline: {
        '@global': {
          '@font-face':{
            fontFamily: tipograf.fontFamily,
          },
        },
      },
      //MuiButton
      MuiIconButton: {
        root: {
          margin: space[1],
          padding: space[3],
          color: colores.primary.main,
          '&:hover':{
            color: colores.primary.main,
            backgroundColor: colores.info.main,
          },
        },
      },
      MuiButton: {
        root: {
          margin: 1,
          color: colores.primary.main,
          borderRadius: space[3],
        },
      },
      //
      MuiTextField: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colores.success.main,
              borderWidth: space[0],
              borderRadius: space[3],
            },
            '&:hover fieldset': {
              borderColor: colores.primary.main,
              borderWidth: space[0],
            },
            '&.Mui-focused fieldset': {
              borderColor: colores.primary.main,
              borderWidth: space[0],
            },
          },
        },
      },

    },
  });
}

const tablas = (configuracion) => {
var colores = paleta;
  if(configuracion!==null){
    if(configuracion.primary_color!==undefined){
      colores = Object.assign({},colores,{
        primary: {main: configuracion.primary_color},
        roseclaro:'#E6E6E6',
        processdone:configuracion.primary_color,
        background: {
          default: '#E6E6E6'
        },
      });
    }
    if(configuracion.secondary_color!==undefined ){
      colores = Object.assign({},colores,{
        secondary: {main: configuracion.secondary_color},
        info: {main: configuracion.secondary_color},
        roseclaro:'#E6E6E6',
        processdone:configuracion.primary_color,
        background: {
          default: '#E6E6E6'
        },
      });
    }
  }
  return createMuiTheme({
    palette: colores,
    typography: Object.assign({},tipografiatablas,tipografiaresponsiva),
    breakpoints: puntos,
    spacing: space,
    overrides: {
      //MuiCssBaseline styles
      MuiCssBaseline: {
        '@global': {
          '@font-face':{
            fontFamily: tipograf.fontFamily,
          },
        },
      },
      //MuiButton
      MuiIconButton: {
        root: {
          margin: space[1],
          padding: space[3],
          color: colores.primary.main,
          '&:hover':{
            color: colores.primary.main,
            backgroundColor: colores.info.main,
          },
        },
      },
      MuiButton: {
        root: {
          margin: 1,
          color: colores.primary.main,
          borderRadius: space[3],
        },
      },
      //
      MuiTextField: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colores.success.main,
              borderWidth: space[0],
              borderRadius: space[3],
            },
            '&:hover fieldset': {
              borderColor: colores.primary.main,
              borderWidth: space[0],
            },
            '&.Mui-focused fieldset': {
              borderColor: colores.primary.main,
              borderWidth: space[0],
            },
          },
        },
      },

    },
  });
}

const TablaEstilo = (props) => {
  return (
    <ThemeProvider theme={tablas(props.configuracion)}>
      {props.children}
    </ThemeProvider>
  );
}

const Estilo = (props) => {
  return (
    <ThemeProvider theme={theme(props.configuracion)}>
      {props.children}
    </ThemeProvider>
  );
}

const mapStateToProps = estado => {
  return {
    configuracion: estado.configuracion,
  }
}
export { TablaEstilo };
export default connect(mapStateToProps, null)(Estilo);