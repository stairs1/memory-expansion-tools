import React, { Component } from "react";
import { url, mxtEnd } from "../constants";

class MXT extends Component {
    state = {
            cache: []
          }
    
    getMxt() {
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODQwNTY2MDMsIm5iZiI6MTU4NDA1NjYwMywianRpIjoiZjM5NTY1MjMtNGQ2MS00NzdiLTg2ZjEtNDFiYjc2YTllZTNiIiwiZXhwIjoxNTg0MDU3NTAzLCJpZGVudGl0eSI6ImNheWRlbnBpZXJjZSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyIsImNzcmYiOiI5Zjk3ZDFmNC1kOWQwLTRjYjctOGU1Ny0zZDYwODJjNjJiYzUifQ.ElcCVCuuNHNGqbbLK70o1XbsJGrVKMN87LUdZv5M9n4";

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
                <ul class="cachelist">
                    {this.state.cache.map((cachep) => (
                    <li class="cacheitem">{cachep}</li>
                    ))}
                  </ul>
                </div>
          )
      }
}


export default MXT
