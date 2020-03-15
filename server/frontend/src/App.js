import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MXT from './components/MXT.js';
import Mem from './components/Mem.js';
import Search from './components/Search.js';
import Signout from './components/Signout.js';
import "./App.css";
import AuthHandle from "./components/AuthHandler.js";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {

   constructor() {
    super();
    this.state = {
      login: true,
      dog: "hello"
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
                <li>
                  <Link to={link}>{name}</Link>
                </li>
        )
    }

    async componentWillMount(){
        this.setState({login: await AuthHandle.authStatus()}, () => { console.log("inappcheck" + this.state.login)});
    }
    
        render() {

      return (
        <Router>
          <div>
            <nav>
              <ul>
                {this.state.login ? this.menuItem("MXT Cache", "/mxt") : null}
                {this.state.login ? this.menuItem("WorkingMemory Cache", "/mem") : null}
                {this.state.login ? this.menuItem("Search", "/search") : null}
                <li>
                  <Link to="/">Signup</Link>
                </li>
                <li>
                  <Link to="/login">Log In</Link>
                </li>
                {this.state.login ? this.menuItem("Logout", "/signout") : null}
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/mxt">
                <MXT />
              </Route>
              <Route path="/mem">
                <Mem />
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
      );
        }
}

export default App
