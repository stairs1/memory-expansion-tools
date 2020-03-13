import Login from './components/Login.js';
import Signup from './components/Signup.js';
import MXT from './components/MXT.js';
import Mem from './components/Mem.js';

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/mxt">MXT Cache</Link>
            </li>
            <li>
              <Link to="/mem">WorkingMemory</Link>
            </li>
            <li>
              <Link to="/">Signup</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
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
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Signup/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
