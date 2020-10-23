import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import { Box, List } from '@material-ui/core'
import TagBin from './TagBin/TagBin'
import AddTag from './AddTag/AddTag'
import StickyTitle from '../StickyTitle/StickyTitle'

export class Tags extends Component {
    render() {
        const { tags } = this.props  
        if (tags != null){ // Displays tag bins if the user has any tags defined
            return (
                <Box m={2} style={{ marginTop: '0px' }}>
                    <StickyTitle type='Tags' />
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
                <Box m={2} style={{ marginTop: '0px' }}>
                    <StickyTitle type='Tags' />
                    <AddTag />
                </Box>
            )
        }        
    }
}

const mapStateToProps = state => ({
    tags: state.dashboard.tags
})

export default connect(mapStateToProps)(Tags)
