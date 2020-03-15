import React, { Component } from "react";
import { url, mxtEnd } from "../constants";
import AuthHandle from "./AuthHandler.js";

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
              <h1>MXT Cache</h1>
                <ul className="cachelist">
            {this.state.cache.length > 0 && this.state.cache.map((cachep) => (
                        <li key={cachep} className="cacheitem">{cachep["talk"]}</li>
                        ))
                    }
                  </ul>
                </div>
          )
      }
}


export default MXT
