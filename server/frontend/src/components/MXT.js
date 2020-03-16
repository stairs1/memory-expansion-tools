import React, { Component } from "react";
import { url, mxtEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import { List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';

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
            <div>
        <Typography type="h1">
              MXT Cache
        </Typography>
        <List>
            
            {this.state.cache.length > 0 && this.state.cache.map((cachep) => (
              <ListItem key={cachep.talk} className="cacheitem">
                  <ListItemText
                    primary={cachep["talk"]}
                  />
                </ListItem>

                        ))
                    }
                            </List>
                </div>
          )
      }
}


export default MXT
