import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import TalkCard from "../../TalkCard";
import { Box, TextField, Button, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

// Actions
import { searchMemories } from '../../../actions/dashboardActions'

export class Search extends Component {
    constructor(){
        super()
        this.state = {
            query: ''
        }
    }

    render() {
        const { searchResults } = this.props
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <SearchIcon />
                    Search
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        autoFocus 
                        id="query" 
                        label="Query" 
                        value={this.state.query} 
                        onChange={this.handleQueryChange} />
                    <br />
                    <Button type="submit" id="submit">Submit</Button>
                    {
                        searchResults.map(memory => {
                            return (
                                <TalkCard data={memory} />
                            )                                
                        })
                    } 
                </form>
            </Box>
        )
    }

    handleQueryChange = event => {
        this.setState({
            query: event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        this.props.searchMemories(this.state.query)
    }
}

const mapStateToProps = state => ({
    searchResults: state.dashboard.searchResults
})

const mapDispatchToProps = {
    searchMemories
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
