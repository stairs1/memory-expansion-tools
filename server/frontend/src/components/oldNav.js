import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { IconButton, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return(
     <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
          </IconButton>
          <Typography variant="h6" >
            MemoryExpansionTools
          </Typography>
          <Button component={Link} to="/" color="inherit">Signup</Button>
          <Button component={Link} to="/login" color="inherit">Login</Button>
            {this.props.login ? <Button component={Link} to="/mxt" color="inherit">MXTCache</Button> : null }
            {this.props.login ? <Button component={Link} to="/stream" color="inherit">MemoryStream</Button> : null}
            {this.props.login ? <Button component={Link} to="/search" color="inherit">Search</Button> : null}
            {this.props.login ? <Button component={Link} to="/signout" color="inherit">Signout</Button> : null }
        </Toolbar>
      </AppBar>
    </div>
    )
}
}

export default NavBar;
