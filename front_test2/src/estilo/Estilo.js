import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import paleta from './Paleta';
import tipografia from './Tipografia';
import tipografiaresponsiva from './TipografiaResponsiva';
import puntos from './Breakpoints';

const space = [0, 4, 8, 16, 32, 64];
const tipograf = Object.assign({},tipografia,tipografiaresponsiva);

const theme = createMuiTheme({
  palette: paleta,
  typography: tipograf,
  breakpoints: puntos,
  spacing: space,
  overrides: {
    MuiButton: {
    	root: {
        margin: 1,
    	},
    },
    MuiTextField: {
      root: {
        margin: 4,
        '&:hover':{
          background: `linear-gradient(90deg,${paleta.secondary.main}, ${paleta.info.main})`,
        },
      },
    },
    MuiContainer: {
    	root: {
    		background: `linear-gradient(90deg,${paleta.primary.xlight}, ${paleta.primary.light})`,
        margin: space[0],
        padding: space[1],
    	},
    },
  },
});

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
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}

export default Estilo;