import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MXT from './components/MXT.js';
import Stream from './components/Stream.js';
import Mem from './components/Mem.js';
import Search from './components/Search.js';
import Signout from './components/Signout.js';
import NavBar from './components/NavBar.js';
//import "./App.css";
import AuthHandle from "./components/AuthHandler.js";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//material-ui stuff
import { AppBar, Typography, MenuList, MenuItem
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: { main: "#111111" },
    secondary: {
      main: '#e31c25',
    },
  },
});

class App extends React.Component {

   constructor() {
    super();
    this.state = {
      login: true
    };
   }

    async updateAuth(){
        this.setState({login: await AuthHandle.authStatus()}, () => { console.log("updater" +this.state.login)});
    }

    foo(){
        return "hello";
    }

   state = {
        login : false
    }

    menuItem(name, link){
        return (
              <MenuItem component={Link} to={link}>
                  <Link to={link}>{name}</Link>
              </MenuItem>
        )
    }

    async componentWillMount(){
        this.setState({login: await AuthHandle.authStatus()}, () => { console.log("inappcheck" + this.state.login)});
    }
    
        render() {

      return (
          <div>
          <ThemeProvider theme={theme}>
        <Router>
          <div>
          <NavBar login={this.state.login} />

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/mxt">
                <MXT />
              </Route>
              <Route path="/stream">
                <Stream />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/login">
                <Login authCallback={this.updateAuth.bind(this)}/>
              </Route>
              <Route path="/signout">
                <Signout authCallback={this.updateAuth.bind(this)}/>
              </Route>
              <Route path="/">
                <Signup/>
              </Route>
            </Switch>
          </div>
        </Router>
          </ThemeProvider>
          </div>
      );
        }
}

export default App
