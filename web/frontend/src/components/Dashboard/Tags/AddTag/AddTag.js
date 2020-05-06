import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import { TextField, Button, Typography } from '@material-ui/core'
import syllable from 'syllable'
import { withAlert } from 'react-alert'

// Actions
import { createTag } from '../../../../actions/dashboardActions'

export class AddTag extends Component {
    constructor(){
        super()
        this.state = {
            newTag: '',
            alert: null
        }
    }

    render() {
        return (
            <Fragment>
                <Typography varient='h7'>
                    Add new tag (make it >=3 syllables so it's reliably picked up by voice transcription)
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        type='text'
                        label='Add a new tag/label'
                        value={this.state.newTag}
                        onChange={this.handleAddTagChange}
                    />
                    <br />
                    <Button type='submit'>Add Tag</Button>
                </form>
            </Fragment>
        )
    }

    handleAddTagChange = event => {
        this.setState({
            newTag: event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        if (syllable(this.state.newTag) >= 3){ // Check that the new tag is at least three syllables
            this.props.createTag(this.state.newTag)
            this.props.alert.success('You just added a new tag.');
            this.setState({
                newTag: ''
            })
        }else
            this.props.alert.error('The tag must be at least three syllables')    
    }
}

const mapDispatchToProps = {
    createTag
}

export default connect(null, mapDispatchToProps)(withAlert()(AddTag))
