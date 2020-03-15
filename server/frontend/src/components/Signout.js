import React, { Component } from 'react';
import { url, loginEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import { Redirect } from "react-router-dom";
import App from "../App.js";

class Signout extends Component {
  state = { logout : false };

  constructor(props) {
    super(props);
      console.log("logging out");
    }
    
  async componentDidMount(){
        this.setState({logout : await AuthHandle.logout()}, console.log("dogs" + this.state.logout));
      this.props.authCallback();
        }
  
            render() {
            return(
                <div>
              <h3>Logging {this.state.logout} you out...</h3>
                {this.state.logout ? <Redirect to="/" /> : null}
                </div>
          )
        }
}

export default Signout
