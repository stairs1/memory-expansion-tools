import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Google Maps for React and API key for authorized access
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
import { API_KEY } from '../../../constants'

// Actions
import { fetchMemories } from '../../../actions/dashboardActions' 

// Styles 
import './MapContainer.css' 

export class MapContainer extends Component {
    render() {
        const { memories, fetchMemories } = this.props
        const mapStyle = {
            width: '100%',
            height: '70vh',
            position: 'relative'
        }
        fetchMemories()
        // Display map if we have memories
        if (memories.length > 0){ 
            // Map center based on the last recorded point
            const initialCenter = {
                lat: memories[memories.length - 1].latitude,
                lng: memories[memories.length - 1].longitude
            }
            return (
                <Fragment>
                    <h1>Map</h1>
                    <Map 
                        google={this.props.google} 
                        ref='resultMap'
                        streetViewControl={false}
                        style={mapStyle}
                        initialCenter={initialCenter}
                        mapTypeControl={false}>
                        {
                            memories.map(memory => {
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
                </Fragment>
            )
        }else{ // Otherwise display to the user that there are no memories to
            return (
                <Fragment>
                    <h1>Map</h1>
                    <div class='no-memories text-center'>
                        No memories to show
                    </div>
                </Fragment>
            )
        }       
    }
    
    // Extends the boundaries of the map so that all of the markers in the map are visible 
    componentDidUpdate(){
        const { memories } = this.props; 
        if (memories.length > 0){
            const bounds = new window.google.maps.LatLngBounds()
            memories.map(memory => {
                bounds.extend(new window.google.maps.LatLng(
                    memory.latitude,
                    memory.longitude
                ))
            })
            this.refs.resultMap.map.fitBounds(bounds)
        }        
    }
}

const gooogleApiKey = {
    apiKey: API_KEY
}

const mapStateToProps = state => ({
    memories: state.dashboard.memories
})

const mapDispatchToProps = {
    fetchMemories
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper(gooogleApiKey)(MapContainer))
