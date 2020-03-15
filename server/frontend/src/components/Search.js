import React, { Component } from "react";
import { url, searchEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";

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
              <h1>Search</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" data-test="query" placeholder="Search query here..." value={this.state.query} onChange={this.handleQueryChange}/>
        <br />
          <input type="submit" value="Log In" data-test="submit" />
            </form>

                <ul className="results">
            {this.state.results.length > 0 && this.state.results.map((result) => (
                        <li key={result} className="searchitem">{result.talk}</li>
                        ))
                    }
                  </ul>
                </div>
          )
      }
}


export default MXT
