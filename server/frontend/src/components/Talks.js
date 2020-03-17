import React, { Component } from "react";
import { Box, Paper, List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';

class TalkItem extends Component{
    
    render() {
        return (
            <Box m={2}>
            <Paper elevation={8}>
                <ListItem >
                <Typography variant="body1" />
                    {this.props.data}
                </ListItem>
            </Paper>
            </Box>
        ) }
}

export default  TalkItem

//    <ListItem key={this.props.talk} className="cacheitem">
//                      <ListItemText
//                        primary={this.props.talk}
//                      />
//                    </ListItem>
//
