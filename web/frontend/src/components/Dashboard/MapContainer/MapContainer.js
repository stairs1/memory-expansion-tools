import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Google Maps for React
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

// Actions
import { fetchMemories } from '../../../actions/dashboardActions' 

export class MapContainer extends Component {
    render() {
        return (
            <Fragment>
                <h1>Map</h1>
                <Map google={this.props.google} />
            </Fragment>
        )
    }

    componentWillMount(){
        this.props.fetchMemories(); 
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
