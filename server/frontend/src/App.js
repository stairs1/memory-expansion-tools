import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MXT from './components/MXT.js';
import Stream from './components/Stream.js';
import Mem from './components/Mem.js';
import Search from './components/Search.js';
import Signout from './components/Signout.js';
import BottomAppBar from './components/Nav.js';
import TitleBar from './components/TitleBar.js';

import CardMedia from '@material-ui/core/CardMedia';

import AuthHandle from "./components/AuthHandler.js";

import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

//material-ui stuff
import { CssBaseline, AppBar, Typography, MenuList, MenuItem
} from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: { main: "#222222", contrastText: "#ffffff"
 },
    secondary: {
        main: '#bf360c', contrastText: "#ffffff"
    },
  },
});

class App extends React.Component {

   constructor() {
    super();
    this.state = {
      login: false
    };
   }

    async updateAuth(){
        this.setState({login: await AuthHandle.authStatus()}, () => { console.log("updater" +this.state.login)});
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
                    <BrowserRouter>
                     <TitleBar />
                <BottomAppBar login={this.state.login} />
                <CssBaseline/> {/* make things always look the same 
                    */}
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
                    </BrowserRouter>
              </ThemeProvider>
          </div>
      );
        }
}

export default App
