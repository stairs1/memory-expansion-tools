import React, { Component } from 'react';
import { url, loginEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import App from "../App.js";
import { Redirect } from "react-router-dom";
import { FormControl, TextField, Button, Typography } from '@material-ui/core';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
        logout : false,
      error: '',
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  async handleSubmit(evt) { //hit backend and get jwt token here
    evt.preventDefault();

    if (!this.state.username) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Password is required' });
    }
    var res = await AuthHandle.login(this.state.username, this.state.password);
      console.log(res);
    if (res){ //use the given username and pass to login (hits the backend with credentials and gets jwt and saves in cookie
        //we should redirect to the MXT cache here
        console.log("success***************");
        this.props.authCallback();
        this.setState({logout : true});
        this.props.authCallback();
		return this.setState({ error: "Successful login."}); //we don't need this, remove once we are redirecting
    } else {
        console.log("FAILLLL***************");
		return this.setState({ error: "Unsuccessful login."});
    }

    return this.setState({ error: '' });
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value,
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)

    return (
      <div className="Login">
        {this.state.logout ? <Redirect to="/mxt" /> : null}
        <Typography type="h1">
        Login
        </Typography>
        <form onSubmit={this.handleSubmit}>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            </h3>
          }
          <TextField autoFocus id="username" label="User Name" value={this.state.username} onChange={this.handleUserChange} /> 
        <br />

          <TextField id="password" type="password" label="Password" value={this.state.password} onChange={this.handlePassChange} /> 
        <br />
            <Button type="submit" id="submit">Log In</Button>
        </form>
      </div>
    );
  }
}

export default Login
