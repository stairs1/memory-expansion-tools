import React, { Component } from "react";
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import { FormControl, TextField, Button, Typography } from '@material-ui/core';

class Mem extends Component{
    constructor() {
        console.log('constructing...');
        super();
        this.state = {
            value: {'phrases': [''], 'stage': ['']}
        };
    }

    componentDidMount(){
        this.connectSock(); //connect to the backend
    }
    
    connectSock() {
        const socket = io("https://memoryexpansiontools.com");
        socket.on("my_response", data => {this.setState({value: data}); this.populate()});
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

//        var listy = [
//            this.state.value.stage[0],
//            this.state.value.stage[1],
//            this.state.value.stage[2],
//            this.state.value.stage[3]
//        ];
//		var listitems = listy.map((child, i) => 
//			React.createElement('li', {key : i}, child)
//		    );
//        ReactDOM.render(
//            React.createElement('ol', {key : "stage"}, listitems),
//            document.getElementById('stage')
//        )
    }

    render() {
        return (
            <div>
        <Typography type="h1">
        Voice Stream
        </Typography>
    <div className='split left'>
        <h3>What I've been saying</h3>
        <hr/>
        <table>
            <colgroup>
                <col></col>
            </colgroup>
            <tr>
                <td><font size="2">DaVinci</font></td>
                <td id='r1'></td>
            </tr>
            <tr>
                <td><font size="2">Galileo</font></td>
                <td id='r2'></td>
            </tr>
            <tr>
                <td><font size = "2">Machiavelli</font></td>
                <td id='r3'></td>
            </tr>
            <tr>
                <td><font size = "2">Noam Chomsky</font></td>
                <td id='r4'></td>
            </tr>
            <tr>
                <td><font size = "2">Inigo Montoya</font></td>
                <td id='r5'></td>
            </tr>
            <tr>
                <td><font size = "2">Salvador Dali</font></td>
                <td id='r6'></td>
            </tr>
            <tr>
                <td><font size = "2">Harry Potter</font></td>
                <td id='r7'></td>
            </tr>
            <tr>
                <td><font size = "2">Nicholas Flamel</font></td>
                <td id='r8'></td>
            </tr>

        </table>
        <div id='phrase list'></div>
    </div>
    <div className='split right'>
        <h3>The important points</h3>
        <hr/>
        <div id='stage'></div>
    </div>
   </div>

    )
}
}

export default Mem
