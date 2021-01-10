const obtenerEstadoUsuario = (props) => {
  app.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("Sesión iniciada");
      props.actualizarUser(Object.assign({},{
        uid:user.uid,
        nombre:user.displayName,
        correo:user.email
      }));
      console.log(user);
      
    }else{
      console.log("No hay sesión iniciada");
      props.actualizarUser(null);
      console.log(user);

    }
  });
}

export default obtenerEstadoUsuario;
