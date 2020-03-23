import React, { Component } from "react";
import { url, mxtEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import TalkItem from "./Talks.js";
import TalkCard from "./TalkCard.js";
import { Box, Paper, List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';

class MXT extends Component {
    state = {
            cache: []
          }
    
    async getMxt() {
        this.token = await AuthHandle.getToken();

    //get the user's mxt cache
	fetch(url + mxtEnd, {
		method: 'GET',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': "Bearer " + this.token
		}}
		).then((response) => response.json())
		.then((data) => {
		console.log('Success:', data);
        this.setState({ cache : data});
		}
		);
    }

    componentDidMount() {
        this.getMxt();
    }
       
       
    render() {
        return (
            <Box m={2}>
            <div>
        <Typography variant="h6">
              MXT Cache
        </Typography>
            <List>
                {this.state.cache.length > 0 && this.state.cache.map((cachep) => (
                    <div>
                    <TalkCard data={cachep} />
                    </div>
                        ))
                    }
                            </List>
                </div>
            </Box>
          )
      }
}


export default MXT
