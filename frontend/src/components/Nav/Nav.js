import React, { Component } from 'react'
import { Link } from "react-router-dom";

// Components
import { AppBar, Toolbar, Card, CardMedia, IconButton } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import HomeIcon from '@material-ui/icons/Home';

// Styles 
import './Nav.css'

export class Nav extends Component {
    render() {
        return (
            <AppBar>
                <Toolbar>
                    <Card id='nav-card'> 
                        <CardMedia 
                            image='https://caydenpierce.com/cloud/mxt_logo_text_orange_grey_small.png'
                            component='img'
                        />
                    </Card>
                    <div id='nav-icons' class='d-flex justify-content-end align-items-center'>
                                              <IconButton component={Link} to='/signout'>
                            <ExitToAppIcon className='nav-icon' />
                        </IconButton>                        
                    </div>
                </Toolbar>                
            </AppBar>
        )
    }
}

export default Nav

/*
  <IconButton component={Link} to="/tools">
                            <HomeIcon className='nav-icon' />
                        </IconButton>
                        <IconButton component={Link} to="/about">
                            <HelpIcon className='nav-icon' />
                        </IconButton>

*/
