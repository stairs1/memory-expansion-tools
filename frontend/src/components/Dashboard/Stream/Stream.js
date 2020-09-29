import React, { Component } from "react"
import { connect } from 'react-redux'

import io from 'socket.io-client'

// Components
import { Box, Typography } from '@material-ui/core'
import TalkCard from "../../TalkCard"
import { url } from "../../../constants"
import PlayArrowIcon from '@material-ui/icons/PlayArrow'

// Actions
import { selectMemory } from '../../../actions/dashboardActions'

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
        this.connectSock() // Connect to the backend
    }
    
    connectSock() {
        const socket = io(url)
        socket.on("my_response", data => {
            this.setState({value: data})
        })
        socket.emit("join", {
            data : "dgs"
        })
    }

    render() {
        const { selectMemory } = this.props
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

const mapDispatchToProps = {
    selectMemory
}

export default connect(null, mapDispatchToProps)(Stream)
