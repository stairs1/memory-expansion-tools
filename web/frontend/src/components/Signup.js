import React, { Component } from "react";
import { url, signupEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import { CardMedia, Paper, Box, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import BackgroundImage from '../res/bg_small.jpg';
import { Redirect } from "react-router-dom";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      email: '',
      name: '',
      error: '',
    }; 
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '',
        success : false
    });
  }


  async handleSubmit(evt) { //hit backend and get jwt token here
    evt.preventDefault();

    if (!this.state.username) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Password is required' });
    }

    if (!this.state.name) {
      return this.setState({ error: 'Name is required' });
    }

    if (!this.state.email) {
      return this.setState({ error: 'Email is required' });
    }
    
      var res = await AuthHandle.signup(this.state.username, this.state.email, this.state.name, this.state.password);

    if (res){ //use the given username and pass to login (hits the backend with credentials and gets jwt and saves in cookie
        //we should redirect to the MXT cache here
        console.log("success***************");
		this.setState({ error: "Successful signup."}); //let em know, but should redirect
		this.setState({ success: true }); //we are redirecting to login page
        return
    } else {
        console.log("FAILLLL***************");
		return this.setState({ error: "Unsuccessful signup."});
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


    handleEmailChange(evt) {
        this.setState({
          email: evt.target.value,
        });
    }
     
    handleNameChange(evt) {
        this.setState({
          name: evt.target.value,
        });
    }
 
       
    render() {
        return (
            <Box m={0}>
            <Box m={2}>
        <Typography variant="h6">
              This is Memory Expansion Tools. Please sign up here.
        </Typography>
        <form onSubmit={this.handleSubmit}>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            {this.state.success ? <Redirect to="/login" /> : null}
            </h3>
          }
          <TextField id="username" label="User Name" value={this.state.username} onChange={this.handleUserChange} /> 
        <br />

          <TextField id="email" label="Email" value={this.state.email} onChange={this.handleEmailChange} /> 
        <br />
          

          <TextField id="name" label="Full Name" value={this.state.name} onChange={this.handleNameChange} /> 
        <br />

          <TextField id="password" type="password" label="Password" value={this.state.password} onChange={this.handlePassChange} /> 
        <br />

            <Button type="submit" id="submit">Sign Up</Button>
        </form>
            </Box>

            </Box>
          )
      }
}


export default Signup
