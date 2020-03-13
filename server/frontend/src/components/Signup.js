import React, { Component } from 'react';

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
    this.handleSubmit = this.handleSubmit.bind(this); this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  handleSubmit(evt) { //hit backend and get jwt token here
    evt.preventDefault();

    if (!this.state.username) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.password) {
      return this.setState({ error: 'Password is required' });
    }
 
    if (!this.state.email) {
      return this.setState({ error: 'Email address is required' });
    }

      if (!this.state.name) {
      return this.setState({ error: 'Name is required' });
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

  handleNameChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

 handleEmailChange(evt) {
    this.setState({
      password: evt.target.value,
    });
  }

  render() {
    // NOTE: I use data-attributes for easier E2E testing
    // but you don't need to target those (any css-selector will work)

    return (
      <div className="Login">
        <h1>Welcome to Memory Expansion Tools. Sign up.</h1>
        <form onSubmit={this.handleSubmit}>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            </h3>
          }
          <input type="text" data-test="username" placeholder="User Name" value={this.state.username} onChange={this.handleUserChange} />
          <br />
          
          <input type="text" data-test="name" placeholder="First and Last Name" value={this.state.name} onChange={this.handleNameChange} />
          <br />

          <input type="text" data-test="email" placeholder="Email" value={this.state.email} onChange={this.handleEmailChange} />
          <br />

          <input type="password" data-test="password" placeholder="Password" value={this.state.password} onChange={this.handlePassChange} />
          <br />

          <input type="submit" value="Sign Up" data-test="submit" />
        </form>
      </div>
    );
  }
}

export default Signup  

