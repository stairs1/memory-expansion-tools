import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Component Imports
import MapContainer from './MapContainer/MapContainer'

export class Dashboard extends Component {
    render() {
        const { memories } = this.props; 
        return (
            <Fragment>
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col-lg-4 col-md-6 col-sm-12'>
                            <MapContainer />
                        </div>                        
                    </div>                    
                </div>                
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
