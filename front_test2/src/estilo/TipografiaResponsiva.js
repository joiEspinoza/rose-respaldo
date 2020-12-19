import { createMuiTheme } from '@material-ui/core/styles';
import puntos from './Breakpoints';

const theme = createMuiTheme({
  breakpoints: puntos,
});


export default {
	h1:{
	  fontSize: '3.5rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '4.7rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '5.35rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '6.0rem',
	  },
	},
	h2:{
	  fontSize: '2.375rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '2.9rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '3.33rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '3.75rem',
	  },
	},
	h3:{
	  fontSize: '2rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '2.5rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '2.8rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '3.0rem',
	  },
	},
	h4:{
	  fontSize: '1.56rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '1.8rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '2.02rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '2.02rem',
	  },
	},
	h5:{
	  fontSize: '1.25rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '1.3rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '1.5rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '1.5rem',
	  },
	},
	h6:{
	  fontSize: '1.13rem',
	  [theme.breakpoints.up('sm')]: {
	    fontSize: '1.25rem',
	  },
	  [theme.breakpoints.up('md')]: {
	    fontSize: '1.25rem',
	  },
	  [theme.breakpoints.up('lg')]: {
	    fontSize: '1.25rem',
	  },
	},
};