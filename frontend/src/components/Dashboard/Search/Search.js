import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import TalkCard from "../../TalkCard";
import { Box, TextField, Button, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

// Actions
import { searchMemories, selectMemory } from '../../../actions/dashboardActions'

export class Search extends Component {
    constructor(){
        super()
        this.state = {
            query: ''
        }
    }

    render() {
        const { searchResults, selectMemory } = this.props
        return (
            <Box m={2}>
                <Typography variant="h6">
                    <SearchIcon />
                    Search
                </Typography>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        id="query" 
                        label="Query" 
                        value={this.state.query} 
                        onChange={this.handleQueryChange} />
                    <br />
                    <Button type="submit" id="submit">Submit</Button>
                    {
                        searchResults.map(memory => {
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
    searchMemories,
    selectMemory
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
