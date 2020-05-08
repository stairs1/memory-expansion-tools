import React, { Component } from 'react'

// Components
import { Typography } from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import LabelImportantIcon from '@material-ui/icons/LabelImportant'
import SearchIcon from '@material-ui/icons/Search'
import MemoryIcon from '@material-ui/icons/Memory'

// Styles
import './StickyTitle.css'

export class StickyTitle extends Component {
    render() {
        const { type } = this.props
        switch(type){
            case('Stream'):
                return (
                    <div class='sticky-title d-flex align-items-center'>
                        <Typography variant="h6">
                            <PlayArrowIcon />
                            Memory Stream
                        </Typography>
                    </div>      
                )
            case('Tags'):
                return (
                    <div class='sticky-title d-flex align-items-center'>
                        <Typography variant="h6">
                            <LabelImportantIcon />
                            Memory Bins
                        </Typography>
                    </div>      
                )
            case('Search'):
                return (
                    <div class='sticky-title d-flex align-items-center'>
                        <Typography variant="h6">
                            <SearchIcon />
                            Search
                        </Typography>
                    </div>      
                )
            case('Cache'):
                return (
                    <div class='sticky-title d-flex align-items-center'>
                        <Typography variant="h6">
                            <MemoryIcon />
                            MXT Cache
                        </Typography>
                    </div>      
                )
        }
    }
}

export default StickyTitle
