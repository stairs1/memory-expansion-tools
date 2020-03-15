import React, { Component } from "react";
import { url, signupEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";

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
		return this.setState({ error: "Successful signup."}); //we don't need this, remove once we are redirecting
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
            <div>
              <h1>Welcome to Memory Expansion Tools. Please sign up here.</h1>
        <form onSubmit={this.handleSubmit}>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            </h3>
          }
          <input type="text" data-test="username" placeholder="User Name" value={this.state.username} onChange={this.handleUserChange} />
        <br />

          <input type="text" data-test="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
        <br />
          
            <input type="text" data-test="name" placeholder="Name" value={this.state.name} onChange={this.handleNameChange} />
        <br />

            <input type="password" data-test="password" placeholder="Password" value={this.state.password} onChange={this.handlePassChange} />
        <br />

          <input type="submit" value="Log In" data-test="submit" />
        </form>

                </div>
          )
      }
}


export default Signup
