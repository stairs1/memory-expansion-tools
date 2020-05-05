import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import { Box, Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';

// Google Maps for React and API key for authorized access
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { API_KEY } from '../../../constants'

// Actions
import { fetchMemories } from '../../../actions/dashboardActions' 

// Styles 
import './MapContainer.css' 

export class MapContainer extends Component {
    render() {
        const { mapMemories } = this.props
        const mapStyle = {
            width: '90%',
            height: '90%'
        }
        // Display map if we have memories
        if (mapMemories.length > 0){ 
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
                            mapMemories.map(memory => {
                                return (
                                    <Marker 
                                        position={{
                                            lat: memory.latitude,
                                            lng: memory.longitude
                                        }} />
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

    // Fetch memories before component mounts
    componentWillMount(){
        this.props.fetchMemories()
    }
    
    /* Extends the boundaries of the map so that all of the markers in the map are visible initially,
       and zooms in on a selected memory if a cache selection is performed */
    componentDidUpdate = () => {
        const { mapMemories, selectedMemory } = this.props
        const bounds = new window.google.maps.LatLngBounds()
        if (mapMemories.length > 0 && selectedMemory == null){
            mapMemories.map(memory => {
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
    mapMemories: state.dashboard.mapMemories,
    selectedMemory: state.dashboard.selectedMemory
})

const mapDispatchToProps = {
    fetchMemories
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper(gooogleApiKey)(MapContainer))
