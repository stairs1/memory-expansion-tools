import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import MapContainer from './MapContainer/MapContainer'
import Search from './Search/Search'
import MXTCache from './MXTCache/MXTCache'
import Stream from './Stream/Stream'
import Tags from './Tags/Tags'
import Transcribe from './Transcribe/Transcribe.js';
import Download from './Download/Download.js';

// Actions
import { fetchMXTCache, getTags } from '../../actions/dashboardActions'

// Styles
import './Dashboard.css'

export class Dashboard extends Component {
    render() {
        return (
            <div>
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-lg-3 col-sm-12' style={{ height: '75vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Stream />
                    </div>           
                    <div class='col-lg-3 col-sm-12' style={{ height: '75vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <MXTCache />
                    </div>
                  <div class='col-lg-6 col-sm-12 position-relative' style={{ height: '75vh', border: '1px solid #bd3a1b' }}>
                        <MapContainer />
                    </div> 

                                        
                </div>   
                <div class='row'>
                      <div class='col-lg-5 col-sm-12' style={{ height: '75vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Search />
                    </div>
                      <div class='col-lg-7 col-sm-12' style={{ height: '75vh', overflowY: 'scroll', border: '1px solid #bd3a1b' }}>
                        <Tags />
                    </div>

                    
                </div>         
                        </div>   
            <div class="bottom-row">
                <div className="transcribe-child">
                    <Transcribe />
                </div>
                <div className="download-child">
                    <Download />
                </div>
                </div>
                <div class='spacer'>
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
