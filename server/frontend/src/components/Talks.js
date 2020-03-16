import React, { Component } from "react";
import { Paper, List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';

class TalkItem extends Component{
    
    render() {
        return (
            <Paper elevation={5}>
                <ListItem >
                <Typography variant="body1" />
                    {this.props.data}
                </ListItem>
            </Paper>
        ) }
}

export default  TalkItem

//    <ListItem key={this.props.talk} className="cacheitem">
//                      <ListItemText
//                        primary={this.props.talk}
//                      />
//                    </ListItem>
//
