import React, { Component } from 'react';
import { Link } from "react-router-dom";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AuthHandle from "./AuthHandler.js";
import { Redirect } from "react-router-dom";
import { ButtonBase, Divider, Card, CardMedia } from '@material-ui/core';
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import '../index.css'; //import form styling css

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
        Memory Expansion Tools <br />
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

class SignInSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      login: false,
      error: '',
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
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
    var res = await AuthHandle.login(this.state.username, this.state.password);
      console.log(res);
    if (res){ //use the given username and pass to login (hits the backend with credentials and gets jwt and saves in cookie
        //we should redirect to the MXT cache here
        console.log("success***************");
        this.props.authCallback();
        this.setState({login : true});
        this.props.authCallback();
        
		return this.setState({ error: "Successful login."}); //we don't need this, remove once we are redirecting
    } else {
        console.log("FAILLLL***************");
		return this.setState({ error: "Unsuccessful login."});
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

    async componentWillMount(){
        //check if we are already logged in. If so, redirect to tools
        const token = AuthHandle.getToken();
        const go = await AuthHandle.authStatus();
        if (go){
            this.setState({login : true});
        }
    }

  render() {
      const { classes } = this.props;
      return (
    <Grid container component="main" className={classes.root}>
        {this.state.login ? <Redirect to="/tools" /> : null}
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
            </Grid><br /><br />
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

              <Grid item xs={5} sm={2}>
		<Typography>
			This website works with the MXT mobile app. Get it here:
		</Typography>
            <ButtonBase onClick={() => window.open("https://play.google.com/store/apps/details?id=com.memoryexpansiontools.mxt", "_blank")} >
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image='https://caydenpierce.com/cloud/en_badge_web_generic.png'
                    />
            </Card>
            </ButtonBase>
            <Divider />
            </Grid>

          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Log in
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form} noValidate>
          {
            this.state.error &&
            <h3 data-test="error" onClick={this.dismissError}>
              {this.state.error}
            </h3>
          }
    Username:
    <input type="text"
	 autocorrect="off" 
	autocapitalize="none" 
	autocomplete="off" 
	class="feedback-input"
	placeholder="Username"
	value={this.state.username}
	onChange={this.handleUserChange}
	id="text" type="text" name="name" />
	<br />
    Password:
    <input 
	id="password" 
	type="password" 
	placeholder="Password"
	class="feedback-input"
	value={this.state.password}
	onChange={this.handlePassChange}
	name="password" />

<<<<<<< HEAD:web/frontend/src/components/SignInSide.js
                     <Button
=======
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="text"
              label="Username (case-sensitive)"
              name="text"
            autoComplete="username"
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
            <Button
>>>>>>> origin/dev-web-transcribe:frontend/src/components/archive/SignInSide.js
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
             Log In 
            </Button>
            <Grid container>
              <Grid item>
                <a href="signup" variant="body2">
                  {"Don't have an account? Sign Up."}
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

export default withStyles(useStyles)(SignInSide)

//
//   <TextField
//              variant="outlined"
//              margin="normal"
//              required
//              fullWidth
//              id="text"
//              type="text"
//              label="Username (case-sensitive)"
//	      InputProps={{autoCapitalize: false, autoComplete: false}}
//              name="text"
//            autoComplete="username"
//                value={this.state.username}
//                onChange={this.handleUserChange}
//            />
//            <TextField
//              variant="outlined"
//              margin="normal"
//              required
//              fullWidth
//              name="password"
//              label="Password"
//              type="password"
//              id="password"
//              autoComplete="current-password"
//                value={this.state.password}
//                onChange={this.handlePassChange}
//            />
//
//<Grid item xs={5} sm={2}>
//            <ButtonBase onClick={() => window.open("https://github.com/stairs1/memory-expansion-tools/", "_blank")} >
//              <Card style={{boxShadow: "none"}}>
//                <CardMedia
//                    component="img"
//                    image='https://caydenpierce.com/cloud/GitHub_Logo.png'
//                    />
//
//                          </Card>
