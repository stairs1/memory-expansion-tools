import React, { Component } from 'react';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { Link } from "react-router-dom";
import AuthHandle from "./AuthHandler.js";
import HelpIcon from '@material-ui/icons/Help';
import { Redirect } from "react-router-dom";
import { AppBar, Toolbar, IconButton } from '@material-ui/core'
import { ButtonBase, Divider, Card, CardMedia } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { spacing } from '@material-ui/system';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';

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

class HowTo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
        logout : false,
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
        this.setState({logout : true});
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


  render() {
      const { classes } = this.props;
      console.log(classes);
      return (
          <Box mb={10}>
    <Grid container component="main" className={classes.root}>
        {this.state.logout ? <Redirect to="/mxt" /> : null}
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

              <Grid item xs={5} sm={2}>
            <ButtonBase onClick={() => window.open("https://play.google.com/store/apps/details?id=com.memoryexpansiontools.mxt", "_blank")} >
              <Card style={{boxShadow: "none"}}>
                <CardMedia
                    component="img"
                    image='https://caydenpierce.com/cloud/en_badge_web_generic.png'
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
            <HelpIcon />
          </Avatar>
          <Typography variant="h4">
            What is this?
          </Typography>
          <br />
          <Typography variant="body1">
                Memory Expansion Tools are designed to serve as an extension to human cognitive capabilities. The long term goal is to make humans smarter and better in every way by enhancing ourselves with technology. As a big step in this direction, we are tackling an area where humans are weakest and technology is strongest: memory/storage.
        <br /><br />
                Use a voice command (wake word "MXT") to allow to save your memories to an external memory cache, the MXT Cache. You can say the wake word at the beginning or at any point in your speech to save the current sentence to the cache. As you go about the day coming up with new ideas and making steps toward solving problems, this cache can be filled with your best thoughts as they come to mind (a kindof high-bandwidth interface note taking). This part of the Memory Expansion Tools system is implemented as Android app. See the link above for Google Play Store download link.
          <br /><br />
          The MXT Cache is the place where all of your tagged ideas go and you can access all of these ideas on the Android app or the web app on any device. Here, you can come across idea after idea that you had throughout the day but you never had a chance to fully think through. This is a "midterm memory" that lasts 24 hours, and adds an extra dimension to thinking. Memory Expansion Tools is is most effective for entrepreneurs, software engineers, writers, and general high performers as these these often have highly optimized thinking and problem solving strategies that are ripe fore extension by an external technolog mind extending tool.
        </Typography>
          <br />
                 <Typography variant="h4">
            How do I use it?
          </Typography>
           <Typography variant="body1" align="left">
                    <ul>
                <li>Visit https://memoryexpansiontools.com to sign up</li>
                <li>Open the app and sign in with the top right "account" button</li>
                <li>Go to MXT app settings, turn on "Live Transcription" and "Remote Server" (as well as "Bluetooth Headset" if you have one, which we highly recomend)</li>
                <li>Say "MXT" at any point in a sentence to save the sentence you are currently speaking to a storage area (MXT Cache) that you can review later</li>
                <li>A live Memory Stream can be viewed in the Android app</li>
                <li>The live Memory Stream and your MXT cache can now be viewed at https://memoryexpansiontools.com</li>
              </ul>

              </Typography>
                 <Typography variant="h4">
                Contact
          </Typography>
           <Typography variant="body1" align="left">
                memoryexpansiontools@gmail.com
              </Typography>


               </div>
      </Grid>
    </Grid>
          </Box>
  );
  }
}

export default withStyles(useStyles)(HowTo)
