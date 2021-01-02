import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import paleta from './Paleta';
import tipografia from './Tipografia';
import tipografiaresponsiva from './TipografiaResponsiva';
import puntos from './Breakpoints';
import { connect } from 'react-redux';



const space = [3, 4, 8, 16, 32, 64, 72, 96, 120, 148, 184];
const tipograf = Object.assign({},tipografia,tipografiaresponsiva);

const theme = (props) => {
  console.log(props);
  return createMuiTheme({
    palette: paleta,
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
          color: paleta.primary.main,
          '&:hover':{
            color: paleta.primary.main,
            backgroundColor: paleta.info.main,
          },
        },
      },
      MuiButton: {
        root: {
          margin: 1,
          color: paleta.primary.main,
          borderRadius: space[3],
        },
      },
      //
      MuiTextField: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: paleta.success.main,
              borderWidth: space[0],
              borderRadius: space[3],
            },
            '&:hover fieldset': {
              borderColor: paleta.primary.main,
              borderWidth: space[0],
            },
            '&.Mui-focused fieldset': {
              borderColor: paleta.primary.main,
              borderWidth: space[0],
            },
          },
        },
      },

    },
  });
}

{/*
TextField
Button
AppBar
Menu
Container
Grid** Definir varios tipos de grid
ImageField
Typografy
MediaQuerys
Footer
Links

*/}


const Estilo = (props) => {
  return (
    <ThemeProvider theme={theme(props.estilo)}>
      {props.children}
    </ThemeProvider>
  );
}

const mapStateToProps = estado => {
  return {
    estilo: estado.estilo,
  }
}

export default connect(mapStateToProps, null)(Estilo);