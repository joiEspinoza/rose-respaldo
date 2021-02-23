import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import { uploadFile } from 'react-s3';

const config = (mail) => {
  return {
    bucketName: 'rosev0',
    dirName: mail, 
    region: 'us-east-2',
    accessKeyId: 'AKIA5XKDKZ4KRSBLKVGI',
    secretAccessKey: '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',
  }
}

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ usuario, className, ...rest }) => {
  const classes = useStyles();
  const logo = useRef();
  var email_cambiado = usuario.correo.replace("@","_");
  const booleano = logo !== undefined;
  const subir = (e) => {
    const st = email_cambiado + "/icono";
    const configu = config(st);
    uploadFile(logo.current.files[0],configu)
    .then(e=>{
      console.log("Subido",logo.current.files[0].name);
    })
    .catch(e=>{
      console.log("Error",logo.current.files[0].name);
    });
  }
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {usuario.nombre}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body1"
          >
            {usuario.correo}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
          component="label"
        >
          Actualizar imagen
          <input
            type="file"
            name="file"
            multiple="multiple"
            hidden
            ref={logo}
            onChange={subir}
          />
        </Button>
      </CardActions>
    </Card>
  );
};

const Cargarimagen = (logo) => {
  return(
    <Button
      color="primary"
      fullWidth
      variant="text"
      component="label"
    >
      Actualizar imagen
      <input
        type="file"
        name="file"
        multiple="multiple"
        hidden
        ref={logo}
      />
    </Button>
  );
}

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
