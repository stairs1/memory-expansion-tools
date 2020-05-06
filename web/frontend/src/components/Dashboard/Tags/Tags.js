import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, List, Typography } from '@material-ui/core'
import LabelImportantIcon from '@material-ui/icons/LabelImportant'
import TagBin from './TagBin/TagBin'
import AddTag from './AddTag/AddTag'

// Actions 
import { getTags } from '../../../actions/dashboardActions'

export class Tags extends Component {
    render() {
        const { tags } = this.props  
        if (tags != null){ // Displays tag bins if the user has any tags defined
            return (
                <Box m={2}>
                    <Typography variant="h6">
                        <LabelImportantIcon />
                        Memory Bins
                    </Typography>
                    <List>
                        {
                            tags.map(tag => {
                                return (
                                    <TagBin 
                                        title={tag} 
                                    />
                                )
                            })
                        }
                    </List>
                    <AddTag />
                </Box>
            )
        }else{ 
            return (
                <Box m={2}>
                    <Typography variant="h6">
                        <LabelImportantIcon />
                        Memory Bins
                    </Typography>
                    <AddTag />
                </Box>
            )
        }        
    }

    componentWillMount() {
        this.props.getTags()
    }
}

const mapStateToProps = state => ({
    tags: state.dashboard.tags
})

const mapDispatchToProps = {
    getTags 
}

export default connect(mapStateToProps, mapDispatchToProps)(Tags)
