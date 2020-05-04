import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, List, Typography } from '@material-ui/core';
import TalkCard from "../../TalkCard";

// Actions 
import { fetchMXTCache } from '../../../actions/dashboardActions'

export class MXTCache extends Component {
    render() {
        const { fetchMXTCache, cache } = this.props 
        fetchMXTCache() 
        return (
            <Box m={2}>
                <Typography variant="h6">
                    MXT Cache
                </Typography>
                <List>
                    {
                        cache.map(memory => {
                            return (
                                <TalkCard data={memory} />
                            )                                
                        })
                    } 
                </List>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    cache: state.dashboard.cache
})

const mapDispatchToProps = {
    fetchMXTCache
}

export default connect(mapStateToProps, mapDispatchToProps)(MXTCache)
