import React, { Component } from "react"
import { connect } from 'react-redux'
import AuthHandler from '../../AuthHandler.js';

import io from 'socket.io-client'

// Components
import { Box, Typography } from '@material-ui/core'
import TalkCard from "../../TalkCard"
import { url } from "../../../constants"
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

// Actions
import { selectMemory, setMXTStream } from '../../../actions/dashboardActions'

class Stream extends Component {
    constructor() {
        super()
        this.state = {
            value: {
                'phrases': [], 
                'stage': []
            }
        }
    }


    componentDidMount(){
        this.connectMemoryStreamSock() // Connect to the backend
    }
    
    async connectMemoryStreamSock() {
        var token = await AuthHandler.getToken();
        console.log("got that token");
        const socket = io(url)
        console.log("SOCK CREATED");

        socket.on("my_response", data => {
            this.props.setMXTStream(data);
            console.log(this.props.mxtstream);
            this.setState({value: data})
        })
        socket.emit("join", {
            data : "dgs"
        })
    }

    render() {
        const { selectMemory, mxtstream, tester } = this.props
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <PlayArrowIcon />
                    Memory Stream
                </Typography>
                <div class='split left'>
                {
                    this.state.value.phrases.map(memory => {
                        memory.selected = false
                        return (
                            <div onClick={() => {
                                if (memory.selected == false){
                                    memory.selected = true
                                    selectMemory(memory)
                                }else{
                                    memory.selected = false
                                    selectMemory(null)
                                }
                            }}>
                                <TalkCard data={memory} />
                            </div>
                        )
                    })
                }
                </div>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    mxtstream: state.dashboard.mxtstream,
    dateRange: state.dashboard.dateRange
})


const mapDispatchToProps = {
    setMXTStream,
    selectMemory
}

export default connect(mapStateToProps, mapDispatchToProps)(Stream)
