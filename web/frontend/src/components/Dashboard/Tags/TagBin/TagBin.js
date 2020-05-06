import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import DeleteIcon from '@material-ui/icons/Delete';
import { Typography, Button } from '@material-ui/core'

// Actions
import { deleteTag } from '../../../../actions/dashboardActions'
import { withAlert } from 'react-alert'

export class TagBin extends Component {
    render() {
        const { deleteTag } = this.props
        return (
            <Fragment>
                <Typography>{this.capitalizeFirstLetter(this.props.title)}</Typography>
                <Button onClick={() => deleteTag(this.props.title)} size="small">
                    <DeleteIcon/>
                </Button>
            </Fragment>
        )
    }

    capitalizeFirstLetter = string => {
        return string[0].toUpperCase() + string.substring(1).toLowerCase() 
    }
}

const mapStateToProps = state => ({
    
})

const mapDispatchToProps = {
    deleteTag
}

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(TagBin))
