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
import Dates from './Dates/Dates.js';

import AuthHandler from '../AuthHandler.js';

import io from 'socket.io-client'
import { url } from "../../constants"
// Actions
import { fetchMXTCache, getTags } from '../../actions/dashboardActions'

// Styles
import './Dashboard.css'

export class Dashboard extends Component {
    constructor() {
        super()
        this.state = {
            value: {
                'phrases': [], 
                'stage': []
            }
        }
    }

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
                <div className="download-child">
                    <Dates/>
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

const mapStateToProps = state => ({
    mxtstream: state.dashboard.stream
})

const mapDispatchToProps = {
    fetchMXTCache, 
    getTags 
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
