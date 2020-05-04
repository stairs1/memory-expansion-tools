import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import MapContainer from './MapContainer/MapContainer'
import Search from './Search/Search'

export class Dashboard extends Component {
    render() {
        return (
            <Fragment>
                <div class='container-fluid'>
                    <div class='row'>
                        <div class='col-lg-4 col-md-6 col-sm-12'>
                            <MapContainer />
                        </div>       
                        <div class='col-lg-4 col-md-6 col-sm-12'>
                            <Search />
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
