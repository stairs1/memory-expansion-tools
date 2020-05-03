import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Google Maps for React
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

// Actions
import { fetchMemories } from '../../../actions/dashboardActions' 

import './MapContainer.css' 

export class MapContainer extends Component {
    render() {
        const { memories } = this.props
        const mapStyle = {
            width: '100%',
            height: '70vh',
            position: 'relative'
        }
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
        }else{
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

    componentWillMount(){
        this.props.fetchMemories(); 
    }

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
    apiKey: 'AIzaSyDrF-e0TO_qHQ1HTokpiZlHSarRz2mlnds'
}

const mapStateToProps = state => ({
    memories: state.dashboard.memories
})

const mapDispatchToProps = {
    fetchMemories
}

export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper(gooogleApiKey)(MapContainer))
