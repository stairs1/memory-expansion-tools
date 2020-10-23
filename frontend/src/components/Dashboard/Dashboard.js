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

import equal from 'fast-deep-equal'
import AuthHandler from '../AuthHandler.js';

import io from 'socket.io-client'
import { url } from "../../constants"
// Actions
import { fetchMXTCache, getTags, setMXTStream } from '../../actions/dashboardActions'

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

//    componentDidMount(){
//        this.connectMemoryStreamSock() // Connect to the backend
//    }
//    
//    async connectMemoryStreamSock() {
//        var token = await AuthHandler.getToken();
//        console.log("got that token");
//        const socket = io(url)
//        console.log("SOCK CREATED");
//
//        socket.on("my_response", data => {
//            console.log("good response");
//            this.setState({value: data})
//            setMXTStream(data);
//        })
//        socket.emit("join", {
//            data : "dgs"
//        })
//    }
//
    render() {
        return (
            <div>
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-lg-3 col-sm-12 dashboard-container left-blur'>
                        <Stream />
                    </div>           
                    <div class='col-lg-3 col-sm-12 dashboard-container'>
                        <MXTCache />
                    </div>
                  <div id="map-container" class='col-lg-6 col-sm-12 dashboard-container right-blur position-relative'>
                        <MapContainer />
                    </div> 

                                        
                </div>   
                <div class='row'>
                      <div class='col-lg-5 col-sm-12 dashboard-container left-blur'>
                        <Search />
                    </div>
                      <div class='col-lg-7 col-sm-12 dashboard-container right-blur' >
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
        const { fetchMXTCache, setMXTStream, getTags } = this.props
        await fetchMXTCache(null, null) 
        await getTags() 
    }

     async componentDidUpdate(prevProps) {
         //if daterange updates, refetch cache
          if(!equal(this.props.dateRange, prevProps.dateRange)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
              {
                 const { dateRange, fetchMXTCache, getTags } = this.props;
                var startDate = dateRange[0].startDate.getTime() / 1000;
                var endDate = dateRange[0].endDate.getTime() / 1000;
                await  fetchMXTCache(startDate, endDate);
                await getTags() 

              }
        }
}

const mapStateToProps = state => ({
    mxtstream: state.dashboard.mxtstream,
    dateRange: state.dashboard.dateRange
})

const mapDispatchToProps = {
    fetchMXTCache, 
    setMXTStream,
    getTags 
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
