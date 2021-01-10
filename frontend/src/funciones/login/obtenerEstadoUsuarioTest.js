import { isMicrosoftLogged, logout } from '../../rose/Msal';

 


const useObtenerEstadoUsuarioTest = (props) => {
	if(props.usuario===null){
        //console.log(isMicrosoftLogged());
        //console.log("Sesión iniciada");
        //1° revisar microsoft
        var userMicrosoft = isMicrosoftLogged();
        if(userMicrosoft){
            //console.log("isMicrosoftLogged",userMicrosoft);
            //ssoSilent();
            //var token = acquireTokenSilent();
            //console.log("Access token",token);
            //props.actualizarUser({
            //  uid: userMicrosoft.accountIdentifier,
            //  nombre:userMicrosoft.name,
            //  correo: userMicrosoft.userName,
            //  accessToken: token,
            //  response: userMicrosoft,
            //});
            //Inicio de sesión microsoft logrado
            logout();
        }else{
            //2° revisar google
        }
    }
    
};

export default useObtenerEstadoUsuarioTest;