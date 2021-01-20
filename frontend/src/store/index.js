import { combineReducers } from 'redux';



function filtrosprocesos(state = [{valor:"ejemplo",variable:"name",tipo:"="}], accion) {
  switch (accion.type) {
    case 'ANADIR_FILTRO':
      var newS = [...state];
      newS.push(accion.nuevoFiltro);
      console.log(newS);
      return newS;
    case 'CAMBIAR_ESTADO_FILTRO':
      return [
        ...state.slice(0,accion.index),
        Object.assign({}, state[accion.index], {
          estado: !state[accion.index]["estado"]
        }),
        ...state.slice(accion.index+1)
      ];
    case 'CAMBIAR_FILTRO_VARIABLE':
      return [
        ...state.slice(0,accion.indice),
        accion.nuevoObjeto,
        ...state.slice(accion.indice+1)
      ];
    case 'ELIMINAR_FILTRO':
      return [
        ...state.slice(0,accion.indice),
        ...state.slice(accion.indice+1)
      ];
    case 'ELIMINAR_TODO':
      return [];
    default:
      return state;
  }
}


function usuario(state = null, accion) {
  switch (accion.type) {
    case 'ACTUALIZAR_USUARIO':
      console.log('ACTUALIZAR_USUARIO',accion.usuario);
      return accion.usuario;
    default:
      return state;
  }
}

function estilo(state = {
  tipography:'Comfortaa',
  primary:"blue",
  info:"green",
}, accion) {
  switch (accion.type) {
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

function eventos(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_EVENTOS':
      return accion.newState;
    default:
      return state;
  }
}

function historico(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_HISTORICO':
      return accion.newState;
    default:
      return state;
  }
}


function bienvenida(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_BIENVENIDA':
      return accion.newState;
    default:
      return state;
  }
}

function configuracion(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_CONFIGURACION':
      return accion.newState;
    default:
      return state;
  }
}

function tutoriales(state = null, accion) {
  switch (accion.type) {
    case 'CARGAR_TUTORIALES':
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

function proceso(state = 0, accion) {
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




let reductorRaiz = combineReducers({ usuario, estilo, procesos, proceso, procesos_exportar_excel, candidato_viewprocess, tutoriales, bienvenida, configuracion, eventos, historico, filtrosprocesos });


export default reductorRaiz;