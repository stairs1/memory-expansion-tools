import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, List, Typography } from '@material-ui/core';
import TalkCard from "../../TalkCard";
import MemoryIcon from '@material-ui/icons/Memory';

// Actions 
import { selectMemory } from '../../../actions/dashboardActions'

export class MXTCache extends Component {
    render() {
        const { cache, selectMemory } = this.props 
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <MemoryIcon />
                    MXT Cache
                </Typography>
                <List>
                    {
                        cache.map(memory => {
                            memory.selected = false 
                            return (
                                <div onClick={() => {
                                        if (memory.selected === false){
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
                </List>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    cache: state.dashboard.cache,
    dateRange: state.dashboard.dateRange,
})

const mapDispatchToProps = {
    selectMemory
}

export default connect(mapStateToProps, mapDispatchToProps)(MXTCache)
