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
        const { cache, searchResults, selectedMemory } = this.props
        // Display map if we have memories in the cache or search results or have selected a memory in the memory stream
        if (cache.length > 0 || searchResults.length > 0 || selectedMemory != null){ 
            return (
                <Box m={2} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Typography variant="h6">
                        <ExploreIcon />
                        Map 
                    </Typography>
                    <div class='map-container'>
                        <Map 
                            google={this.props.google} 
                            ref='resultMap'
                            streetViewControl={false}
                            mapTypeControl={false}>
                            { 
                                cache.map(memory => { // Display red markers on the map for memories that are in the cache and not in the search result
                                    if (memory.latitude && memory.longitude && !this.containsMemory(cache, memory))
                                        return (
                                            <Marker 
                                                title={memory.talk}
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
                                                title={memory.talk}
                                                position={{
                                                    lat: memory.latitude,
                                                    lng: memory.longitude
                                                }}
                                                icon={{url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}} />
                                        )
                                })
                            }
                            {
                                (selectedMemory && selectedMemory.latitude && selectedMemory.longitude) ?
                                <Marker 
                                    title={selectedMemory.talk}
                                    position={{
                                        lat: selectedMemory.latitude,
                                        lng: selectedMemory.longitude
                                    }}
                                    icon={{url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}} />
                                : null
                            }
                        </Map>
                    </div>
                    <br />
                    <div class='legend'>
                        <div id='red-marker' class='legend-icon' />
                        : cached memory &nbsp;&nbsp;
                        <div id='blue-marker' class='legend-icon' />
                        : search result &nbsp;&nbsp;
                        <div id='green-marker' class='legend-icon' />
                        : selected memory
                    </div>
                </Box>
            )
        }else{ // Otherwise display to the user that there are no memories to show
            return (
                <Box m={2} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Typography variant="h6">
                        <ExploreIcon />
                        Map
                    </Typography>
                    <div class='no-memories text-center'>
                        No memories to show. Memories in the MXT cache and search results will appear here.
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
        const { cache, searchResults, selectedMemory } = this.props
        const bounds = new window.google.maps.LatLngBounds()
        if ((cache.length > 0 || searchResults.length > 0) && selectedMemory == null){
            cache.concat(searchResults).map(memory => {
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
            this.refs.resultMap.map.setZoom(13)
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
