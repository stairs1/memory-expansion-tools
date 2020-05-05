import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Box, Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';

// Google Maps for React and API key for authorized access
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { API_KEY } from '../../../constants'

// Styles 
import './MapContainer.css' 

export class MapContainer extends Component {
    render() {
        const { cache, searchResults } = this.props
        const mapStyle = {
            width: '90%',
            height: '90%'
        }
        // Display map if we have memories
        if (cache.length > 0){ 
            return (
                <Box m={2}>
                    <Typography variant="h6">
                        <ExploreIcon />
                        Map
                    </Typography>
                    <Map 
                        google={this.props.google} 
                        ref='resultMap'
                        streetViewControl={false}
                        style={mapStyle}
                        mapTypeControl={false}>
                        { 
                            cache.map(memory => { // Display red markers on the map for memories that are in the cache and not in the search result
                                if (memory.latitude && memory.longitude && !this.containsMemory(cache, memory))
                                    return (
                                        <Marker 
                                            position={{
                                                lat: memory.latitude,
                                                lng: memory.longitude
                                            }}
                                            icon={{url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"}} />
                                    )
                            })
                        }
                        {
                            searchResults.map(memory => { // Display blue markers on the map for any memories in the search results  
                                if (memory.latitude && memory.longitude)
                                    return (
                                        <Marker 
                                            position={{
                                                lat: memory.latitude,
                                                lng: memory.longitude
                                            }}
                                            icon={{url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}} />
                                    )
                            })
                        }
                    </Map>
                </Box>
            )
        }else{ // Otherwise display to the user that there are no memories to show
            return (
                <Box m={2}>
                    <Typography variant="h6">
                        Map
                    </Typography>
                    <div class='no-memories text-center'>
                        No memories to show
                    </div>
                </Box>
            )
        }       
    }

    // Function used to check if the cache contians a search result of not (compare by value instead of reference)
    containsMemory = (arr, memory) => {
        arr.forEach(mem => {
            if (mem.latitude == memory.latitude && mem.longitude == memory.longitude && mem.address == memory.address 
                && mem.timestamp == memory.timestamp && mem.talk == memory.talk)
                return true
        })
        return false
    }
    
    /* Extends the boundaries of the map so that all of the markers in the map are visible initially,
       and zooms in on a selected memory if a selection is performed */
    componentDidUpdate = () => {
        const { cache, selectedMemory } = this.props
        const bounds = new window.google.maps.LatLngBounds()
        if (cache.length > 0 && selectedMemory == null){
            cache.map(memory => {
                bounds.extend(new window.google.maps.LatLng(
                    memory.latitude,
                    memory.longitude
                ))
            })
            this.refs.resultMap.map.fitBounds(bounds)
        }else if (selectedMemory != null){
            bounds.extend(new window.google.maps.LatLng(
                selectedMemory.latitude,
                selectedMemory.longitude
            ))
            this.refs.resultMap.map.fitBounds(bounds)
            this.refs.resultMap.map.setZoom(15)
        }
    }
}

const gooogleApiKey = {
    apiKey: API_KEY
}

const mapStateToProps = state => ({
    cache: state.dashboard.cache,
    searchResults: state.dashboard.searchResults, 
    selectedMemory: state.dashboard.selectedMemory
})

export default connect(mapStateToProps)(GoogleApiWrapper(gooogleApiKey)(MapContainer))
