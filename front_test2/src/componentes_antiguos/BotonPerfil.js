import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

const ProfileMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  let history = useHistory();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const registro = () => {
    handleClose();
    history.push("/Registro");
  }
  const login = () => {
    handleClose();
    history.push("/Login");
  }
  const logout = () => {
    handleClose();
    history.push("/Logout");
  }
  return (
    <div style={{marginLeft: 'auto'}}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        {"Cuenta"}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.usuario === null && <MenuItem onClick={registro}>Registrarse</MenuItem>}
        {props.usuario === null && <MenuItem onClick={login}>Iniciar Sesión</MenuItem>}
        {props.usuario !== null && <MenuItem onClick={logout}>Terminar Sesión</MenuItem>}

      </Menu>
    </div>
  );
}


export default ProfileMenu;