import { combineReducers } from 'redux';






function usuario(state = null, accion) {
  switch (accion.type) {
    case 'ACTUALIZAR_USUARIO':
      console.log('ACTUALIZAR_USUARIO',accion.usuario);
      return accion.usuario;
    default:
      return state;
  }
}

function procesos(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_PROCESOS':
      return accion.newState;
    default:
      return state;
  }
}

function procesos_exportar_excel(state = [], accion) {
  switch (accion.type) {
    case 'DEFINIR_PROCESOS_EXPORTAR_EXCEL':
      return accion.newState;
    default:
      return state;
  }
}

function proceso_viewprocess(state = null, accion) {
  switch (accion.type) {
    case 'SELECCIONAR_PROCESO':
      return accion.newIndex;
    default:
      return state;
  }
}

function candidato_viewprocess(state = 0, accion) {
  switch (accion.type) {
    case 'SELECCIONAR_CANDIDATO':
      console.log(accion.newIndex);
      return accion.newIndex;
    default:
      return state;
  }
}




let reductorRaiz = combineReducers({ usuario, procesos, proceso_viewprocess, procesos_exportar_excel, candidato_viewprocess });


export default reductorRaiz;