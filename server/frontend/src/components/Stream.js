import React, { Component } from "react";
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import { List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';

class Stream extends Component{
    
   
    constructor() {
        console.log('constructing...');
        super();
        this.state = {
            value: {'phrases': [], 'stage': []}
        };
    }

    componentDidMount(){
        this.connectSock(); //connect to the backend
    }
    
    connectSock() {
        const socket = io("https://memoryexpansiontools.com");
        socket.on("my_response", data => {this.setState({value: data}); console.log("hitting sock")});
        socket.emit("join", {data : "dgs"});
        console.log("SockIO connected, room joined.");
    }

    populate() {
        console.log("populate called");
        for (var i=0; i < 8; i++){
            var is = (i+1).toString()
            console.log( this.state.value.phrases[i]);
            ReactDOM.render(
                React.createElement('p', null, this.state.value.phrases[i]),
                document.getElementById("r"+is)
            )
        }
    }

    render() {
        return (
            <div>
        <Typography type="h1">
        Memory Stream
        </Typography>
    <div className='split left'>
            {this.state.value.phrases.length > 0 && this.state.value.phrases.map((data) => (
              <ListItem variant="outlined" key={data}>
                  <ListItemText
                    primary={data}
                  />
                </ListItem>
            ))}

    </div>
   </div>

    )
}
}

export default Stream
