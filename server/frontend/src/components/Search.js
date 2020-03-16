import React, { Component } from "react";
import TalkItem from "./Talks.js";
import { url, searchEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";
import { List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';

class MXT extends Component {
  constructor() {
    super();
    this.state = {
      results: [],
      query: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
  }


    async getSearch() {
        this.token = await AuthHandle.getToken();

    //get the user's mxt cache
	fetch(url + searchEnd, {
		method: 'POST',
		headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': "Bearer " + this.token
		},
        body: JSON.stringify({ "time" : 0, "phrases" : [ {"speech" : this.state.query} ]})
        }).then((response) => response.json())
		.then((data) => {
		console.log('Success:', data);
        this.setState({ results : data});
		}
		);
    }

    async handleSubmit(evt){
        evt.preventDefault();
        this.getSearch();
    }

  handleQueryChange(evt) {
    this.setState({
      query: evt.target.value,
    });
  }

    render() {
        return (
           <div>
         <Typography variant="h3">
              Search
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <TextField autoFocus id="query" label="Query" value={this.state.query} onChange={this.handleQueryChange} /> 
        <br />
            <Button type="submit" id="submit">Submit</Button>
            </form>

            {this.state.results.length > 0 && this.state.results.map((result) => (
                  <TalkItem data={result.talk} />
                        ))
                    }
                </div>
          )
      }
}


export default MXT
