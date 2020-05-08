import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import { TextField, Button, Typography } from '@material-ui/core'
import syllable from 'syllable'
import { withAlert, positions } from 'react-alert'

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
                    Add new tag (make it >=2 syllables so it's reliably picked up by voice transcription)
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
        const { newTag } = this.state
        const { tags } = this.props
        event.preventDefault()
        if (syllable(newTag) < 2) // Check that the new tag is at least two syllables
            this.props.alert.error('The tag must be at least two syllables', {
                position: positions.BOTTOM_RIGHT
            })     
        else if (tags.includes(newTag)){ // Check that the tag doesn't already exist
            this.props.alert.error('That tag already exists', {
                position: positions.BOTTOM_RIGHT
            }) 
        }else{
            this.props.createTag(newTag)
            this.props.alert.success('Successfully created tag', { 
                position: positions.BOTTOM_RIGHT 
            })
            this.setState({
                newTag: ''
            })
        }
    }
}

const mapStateToProps = state => ({
    tags: state.dashboard.tags
})

const mapDispatchToProps = {
    createTag
}

export default connect(mapStateToProps, mapDispatchToProps)(withAlert()(AddTag))
