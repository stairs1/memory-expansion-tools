import React, { Component } from 'react'

// Components
import MapContainer from './MapContainer/MapContainer'
import Search from './Search/Search'
import MXTCache from './MXTCache/MXTCache'
import Stream from './Stream/Stream'
import Tags from './Tags/Tags'

export class Dashboard extends Component {
    render() {
        return (
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-lg-6 col-sm-12' style={{ height: '70vh', border: '1px solid #bd3a1b' }}>
                        <MapContainer />
                    </div>            
                    <div class='col-lg-3 col-sm-12' style={{ height: '70vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <MXTCache />
                    </div>
                    <div class='col-lg-3 col-sm-12' style={{ height: '70vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Search />
                    </div>  
                </div>   
                <div class='row'>
                    <div class='col-lg-6 col-sm-12' style={{ height: '70vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Stream />
                    </div>
                    <div class='col-lg-6 col-sm-12' style={{ height: '70vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Tags />
                    </div>
                </div>         
            </div>   
        )
    }
}

export default Dashboard
