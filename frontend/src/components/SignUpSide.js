import React, { Component } from 'react';
import AuthHandle from "./AuthHandler.js";
import { Redirect } from "react-router-dom";
import { ButtonBase, Divider, Card, CardMedia } from '@material-ui/core';
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help';
import Avatar from '@material-ui/core/Avatar';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import memoruxLogo from '../images/memorux_logo_plain_dark.png'
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Memorux <br />
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = (theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://caydenpierce.com/cloud/landingpage.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignUpSide extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      email: '',
      name: '',
      error: '',
      signup: false,
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
		this.setState({ error: "Successful signup. Please log in."}); //let em know, but should redirect
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
      const { classes } = this.props;
      console.log(classes);
      return (
    <Grid container component="main" className={classes.root}>
        {this.state.logout ? <Redirect to="/login" /> : null}
        {this.state.success ? <Redirect to="/login" /> : null}
      <CssBaseline />
      <Grid item xs={false} sm={4} md={6} className={classes.image} />
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square>
        <div className={classes.paper}>
              <Grid item sm={6}>
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image='https://caydenpierce.com/cloud/mxt_logo_text_trans.png'
                    
                    />
            </Card>
            </Grid><br />
<Grid item sm={6}>
                <Typography>
                    Created by:
                </Typography>
            </Grid>
<Grid item sm={3}>
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image={memoruxLogo}
                    />
            </Card>
            </Grid><br />


            <Grid item elevation={0} square>

            <IconButton component={Link} to="/login">
                <LockOpenIcon/>
                <Typography>
                    Login
                </Typography>
            </IconButton>
            <IconButton component={Link} to="/signup">
                <AccountCircleIcon/>
                <Typography>
                   Sign Up 
                </Typography>
            </IconButton>
            <IconButton component={Link} to="/about">
                <HelpIcon/>
                <Typography>
                   About 
                </Typography>
            </IconButton>


              </Grid>

            <br /><br />

              <Grid item xs={6} sm={3}>
            <ButtonBase onClick={() => window.open("https://play.google.com/store/apps/details?id=com.memoryexpansiontools.mxt", "_blank")} >
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'
                    
                    />
            </Card>
            </ButtonBase>
            </Grid>
  <Grid item xs={5} sm={2}>
            <ButtonBase onClick={() => window.open("https://github.com/stairs1/memory-expansion-tools/", "_blank")} >
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image='https://caydenpierce.com/cloud/GitHub_Logo.png'
                    />
            </Card>
            </ButtonBase>
            <Divider />
            </Grid>

          <Avatar className={classes.avatar}>
            <AccountCircleIcon/>
          </Avatar>
          <Typography component="h1" variant="h4">
            Sign Up
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            </h3>
          }

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Username (case-sensitive)"
              name="username"
              autoComplete="username"
              autoFocus
                value={this.state.username}
                onChange={this.handleUserChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
                value={this.state.password}
                onChange={this.handlePassChange}
            />
        <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email"
              type="text"
              id="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
            />
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="text"
              id="name"
                value={this.state.name}
                onChange={this.handleNameChange}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
             Sign Up
            </Button>
           <Grid container>
              <Grid item>
                <a href="login" variant="body2">
                  {"Already have an account? Log in."}
                </a>
              </Grid>
            </Grid>

            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
  }
}

export default withStyles(useStyles)(SignUpSide)
