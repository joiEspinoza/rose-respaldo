import React, { Component } from 'react'
import GoogleLogin from 'react-google-login'
export class App extends Component {

  responseGoogle=(response)=>{
    console.log(response);
    console.log(response.profileObj);
    
    
  }
  render() {
    return (
      <div>
        <GoogleLogin
        clientId="374514394577-gn2bvmp9cjnsjn53aq0p575mdidpot47.apps.googleusercontent.com"
        buttonText="Login"
		//accessType="offline"
		//responseType="code" 
		//prompt= "consent"
		scope="https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        cookiePolicy={'single_host_origin'}
        
        />
      </div>
    )
  }
}

export default App