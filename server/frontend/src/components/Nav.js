import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MemoryIcon from '@material-ui/icons/Memory';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';

import { Button, Popper, Menu, MenuItem, CssBaseline, AppBar, Typography, MenuList
} from '@material-ui/core';

import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  palette: {
    primary: { main: "#111111", contrastText: "#ffffff"
 },
    secondary: {
        main: '#c53211', contrastText: "#ffffff"
    },
      textPrimary : { main: '#fff'},
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
    iconButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function BottomAppBar(props) {
  const [accountMenu, setAccountMenu] = useState(false);

  const classes = useStyles();


      const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

    const handleAccountMenuClick = function() {
        console.log("CLIIIIIIICKKKKKKKK");
        setAccountMenu(!accountMenu);
    }

    const accountMenuBuilder = function() {
        console.log("BUIIIIIIIIIIIIIIIIIIIIIIIIIIII");
            return (
                <div>
      <IconButton ref={anchorRef}
                  aria-controls={open ? 'menu-list-grow' : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                    id="accountMenuButton" 
                color="secondary" 
                edge="start" 
                classes={{label: classes.iconButtonLabel}}
                >
            <AccountCircleIcon onClick={handleAccountMenuClick} />
            <Typography variant="body2"></Typography>
          </IconButton>
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                        <MenuItem component={Link} to="/signup" onClick={handleClose}>Sign Up</MenuItem>
                        <MenuItem component={Link} to="/login" onClick={handleClose}>Log In</MenuItem>
                  {props.login && <MenuItem component={Link} to="/signout" onClick={handleClose}>Log Out</MenuItem> }
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
          )
    }
    
        
    const userMenu = function() {
        if (props.login){
            console.log("trueeeeee");
            return (
                <div>
               <IconButton color="secondary" component={Link} to="/stream" classes={{label: classes.iconButtonLabel}}>
                <PlayArrowIcon />
                <Typography variant="body2">Stream</Typography>
                
              </IconButton>
              <IconButton color="secondary" component={Link} to="/mxt" classes={{label: classes.iconButtonLabel}}>
                <MemoryIcon />
                <Typography variant="body2">Cache</Typography>
              </IconButton>
              <IconButton color="secondary" component={Link} to="/search" classes={{label: classes.iconButtonLabel}}>
                <SearchIcon />
                <Typography variant="body2">Search</Typography>
              </IconButton>
                </div>
            )
        } else {
            console.log("FALLLLLLLLLLSEEEEEE");
            return null;
        }
    }

  return (
      <React.Fragment>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
            {accountMenuBuilder()}
          {/*
          <Fab color="secondary" aria-label="add" className={classes.fabButton}>
            <AddIcon />
          </Fab>
      */}
          <div className={classes.grow} />
            {userMenu()}
               </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
