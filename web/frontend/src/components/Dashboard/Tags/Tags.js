import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, Typography } from '@material-ui/core'
import LabelImportantIcon from '@material-ui/icons/LabelImportant'

export class Tags extends Component {
    render() {
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <LabelImportantIcon />
                    Memory Bins
                </Typography>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
