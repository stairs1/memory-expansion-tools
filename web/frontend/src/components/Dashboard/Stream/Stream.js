import React, { Component } from "react";

import io from 'socket.io-client';

// Components
import { Box, Typography } from '@material-ui/core';
import TalkCard from "../../TalkCard";
import { url } from "../../../constants";

class Stream extends Component {
    constructor() {
        super()
        this.state = {
            value: {'phrases': [], 'stage': []}
        }
    }

    componentDidMount(){
        this.connectSock() //connect to the backend
    }
    
    connectSock() {
        const socket = io(url)
        socket.on("my_response", data => {this.setState({value: data}); console.log(this.state.value.phrases[0])})
        socket.emit("join", {data : "dgs"})
    }

    render() {
        return (
            <Box m={2}>
                <Typography variant="h6">
                    Memory Stream
                </Typography>
                <div class='split left'>
                {
                    this.state.value.phrases.map(memory => {
                        return (
                            <TalkCard data={memory} />
                        )
                    })
                }
                </div>
            </Box>
        )
    }
}

export default Stream
