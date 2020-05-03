import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Component Imports
import MapContainer from './MapContainer/MapContainer'

export class Dashboard extends Component {
    render() {
        const { memories } = this.props; 
        return (
            <Fragment>
                <h1>Memory Dashboard</h1>
                <MapContainer />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
