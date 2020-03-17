import React, { Component } from "react";
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import { Box, Paper, List, ListItem, ListItemText, FormControl, TextField, Button, Typography } from '@material-ui/core';
import TalkItem from "./Talks.js";
import { spacing } from '@material-ui/system';

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
        socket.on("my_response", data => {this.setState({value: data}); console.log(this.state.value.phrases[0])});
        socket.emit("join", {data : "dgs"});
        console.log("SockIO connected, room joined.");
    }

    render() {
        return (
            <Box m={2}>
        <Typography variant="h4">
        Memory Stream
        </Typography>
    <div className='split left'>
            {this.state.value.phrases.length > 0 && this.state.value.phrases.map((data) => (
                <TalkItem data={data} />
            ))}

    </div>
            </Box>

    )
}
}

export default Stream
