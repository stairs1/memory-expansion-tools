import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import DeleteIcon from '@material-ui/icons/Delete'
import { Typography, Button } from '@material-ui/core'
import TalkCard from '../../../TalkCard'

// Actions
import { deleteTag, selectMemory } from '../../../../actions/dashboardActions'
import { withAlert, positions } from 'react-alert'

export class TagBin extends Component {
    render() {
        const { title, tagBins, selectMemory } = this.props
        return (
            <Fragment>
                <Typography>
                    {this.capitalizeFirstLetter(title)}
                    <Button onClick={this.deleteIconClick} size="small">
                        <DeleteIcon/>
                    </Button>
                </Typography>
                {
                    (tagBins[title].length > 0) ?  
                    <Fragment>
                    {
                        tagBins[title].map(memory => {
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
                    </Fragment> 
                    : null
                }
            </Fragment>
        )
    }

    deleteIconClick = () => {
        const { title, deleteTag } = this.props
        deleteTag(title)
        this.props.alert.success('Successfully deleted tag', {
            position: positions.BOTTOM_RIGHT
        })
    }

    capitalizeFirstLetter = string => {
        return string[0].toUpperCase() + string.substring(1).toLowerCase() 
    }
}

const mapStateToProps = state => ({
    tagBins: state.dashboard.tagBins
})

const mapDispatchToProps = {
    deleteTag,
    selectMemory
}

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(TagBin))
