import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, List, Typography } from '@material-ui/core';
import TalkCard from "../../TalkCard";
import MemoryIcon from '@material-ui/icons/Memory';

// Actions 
import { fetchMXTCache, selectMemory } from '../../../actions/dashboardActions'

export class MXTCache extends Component {
    render() {
        const { fetchMXTCache, cache } = this.props 
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
                                        if (memory.selected == false){
                                            memory.selected = true
                                            this.handleCacheItemClick(memory)
                                        }else{
                                            memory.selected = false
                                            this.handleCacheItemClick(null)
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

    componentWillMount = () => {
        this.props.fetchMXTCache() 
    }

    handleCacheItemClick = memory => {
        this.props.selectMemory(memory)
    }
}

const mapStateToProps = state => ({
    cache: state.dashboard.cache
})

const mapDispatchToProps = {
    fetchMXTCache,
    selectMemory
}

export default connect(mapStateToProps, mapDispatchToProps)(MXTCache)
