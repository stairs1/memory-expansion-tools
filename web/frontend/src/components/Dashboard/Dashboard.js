import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import MapContainer from './MapContainer/MapContainer'
import Search from './Search/Search'
import MXTCache from './MXTCache/MXTCache'
import Stream from './Stream/Stream'
import Tags from './Tags/Tags'

// Actions
import { fetchMXTCache, getTags } from '../../actions/dashboardActions'

// Styles
import './Dashboard.css'

export class Dashboard extends Component {
    render() {
        return (
            <div class='container-fluid'>
                <div class='row'>
                    <div id='map-container' class='col-lg-6 col-sm-12 dashboard-container position-relative'>
                        <MapContainer />
                    </div>            
                    <div class='col-lg-3 col-sm-12 dashboard-container'>
                        <MXTCache />
                    </div>
                    <div class='col-lg-3 col-sm-12 dashboard-container'>
                        <Search />
                    </div>  
                </div>   
                <div class='row'>
                    <div class='col-lg-6 col-sm-12 dashboard-container'>
                        <Stream />
                    </div>
                    <div class='col-lg-6 col-sm-12 dashboard-container'>
                        <Tags />
                    </div>
                </div>         
            </div>   
        )
    }

    async componentWillMount(){
        const { fetchMXTCache, getTags } = this.props
        await fetchMXTCache() 
        await getTags() 
    }
}

const mapDispatchToProps = {
    fetchMXTCache, 
    getTags 
}

export default connect(null, mapDispatchToProps)(Dashboard)
