import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, Typography } from '@material-ui/core'
import LabelImportantIcon from '@material-ui/icons/LabelImportant'

// Actions 
import { createTag, deleteTag, getTags } from '../../../actions/dashboardActions'

export class Tags extends Component {
    render() {
        const { cache } = this.props  
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <LabelImportantIcon />
                    Memory Bins
                </Typography>
            </Box>
        )
    }

    componentWillMount() {
        this.props.getTags()
    }
}

const mapStateToProps = (state) => ({
    cache: state.dashboard.cache 
})

const mapDispatchToProps = {
    createTag,
    deleteTag,
    getTags 
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
