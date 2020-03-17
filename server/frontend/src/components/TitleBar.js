import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { CardMedia, CardAction, Card, CardContent, CardActions, CardActionArea, IconButton, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {           // this is the`className` passed to `CardMedia` later
  },
});

class TitleBar extends Component {
    render() {
        const { classes } = this.props;
        return(
     <div>
      <AppBar position="static">
        <Toolbar>
            <Card className={classes.card} >
                    <CardMedia
                        className={classes.media}
                      component="img"
                      image="https://caydenpierce.com/cloud/mxt_logo_text_orange_grey_small.png"
                      
                    />
                </Card>
        </Toolbar>
      </AppBar>
    </div>
    )
}
}

export default withStyles(styles)(TitleBar);
