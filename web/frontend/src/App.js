import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MXT from './components/MXT.js';
import Stream from './components/Stream.js';
import Mem from './components/Mem.js';
import Search from './components/Search.js';
import Signout from './components/Signout.js';
import BottomAppBar from './components/Nav.js';
import TitleBar from './components/TitleBar.js';
import SignInSide from './components/SignInSide.js';
import SignUpSide from './components/SignUpSide.js';
import HowTo from './components/HowTo.js';

import CardMedia from '@material-ui/core/CardMedia';

import AuthHandle from "./components/AuthHandler.js";
import MetaTags from 'react-meta-tags';

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
          <div>
              <ThemeProvider theme={theme}>
          <MetaTags>
            <title>MXT | Memory Expansion Tools</title>
            <meta name="description" content="These are tools used to expand your memory. Expanding one's memory is extending one's thinking. If we are able to capture all of someone's thoughts, ideas, and experiences, we give them the ability to think with in an entirely new way, a way that takes into consideration an extended amount of ideas and information.." />
            <meta property="og:title" content="MXT | Memory Expansion Tools<" />
            <meta property="og:image" content="https://caydenpierce.com/cloud/mxt_logo_text_orange_grey_small.png" />
          </MetaTags>
                    <BrowserRouter>
                <BottomAppBar login={this.state.login} />
                <CssBaseline/> {/* make things always look the same 
                    */}
                        {/* A <Switch> looks through its children <Route>s and
                            renders the first one that matches the current URL. */}
                        <Switch>
                          <Route path="/mxt">
                            <TitleBar/>
                            <MXT />
                          </Route>
                          <Route path="/stream">
                            <TitleBar/>
                            <Stream />
                          </Route>
                          <Route path="/search">
                            <TitleBar/>
                            <Search />
                          </Route>
          {/* <Route path="/login">
                            <TitleBar/>
                            <Login authCallback={this.updateAuth.bind(this)}/>
                          </Route>  */}                        
                          <Route path="/signout">
                            <Signout authCallback={this.updateAuth.bind(this)}/>                          
                            </Route>

                          <Route path="/signup">
                            <SignUpSide/>
                          </Route>
                          <Route path="/howto">
                            <HowTo/>
                          </Route>
                            }
                          <Route path="/">
                            <SignInSide authCallback={this.updateAuth.bind(this)}/>
                          </Route>
                        </Switch>
                    </BrowserRouter>
              </ThemeProvider>
          </div>
          </div>
      );
        }
}

export default App


