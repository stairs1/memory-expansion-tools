import React, { Component, useState } from 'react';
import { connect } from 'react-redux'
import { addDays } from 'date-fns';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { saveDate, transcribeHandshake, transcribe, transcribeSubmit, downloadAction, setDateRange } from '../../../actions/dashboardActions'
import { createBrowserHistory } from 'history'
import { Box, FormControl, TextField, Button, ButtonBase, Typography, Popover } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DateRangeIcon from '@material-ui/icons/DateRange';
//date picker lib
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { DateRange, DateRangePicker } from 'react-date-range';

const history = createBrowserHistory();

function setCaretPosition(ele, caretPos) {
		if(ele != null) {
				if(ele.createTextRange) {
						var range = ele.createTextRange();
						range.move('character', caretPos);
						range.select();
						ele.focus();
				}
				else {
						if(ele.selectionStart) {
								ele.focus();
								ele.setSelectionRange(caretPos, caretPos);
						}
						else
								ele.focus();
				}
		}
}

function str_splice(main, sub, at = undefined) {
	return main.slice(0, at || undefined)
		+ sub
		+ (at === undefined || at === null ? '' : main.slice(at));
}

class Dates extends Component {
	constructor(props) {
		super(props);
		this.state = {
            startDate : new Date(),
            open : false,
            anchorEl : null,
            dateRange: [
                {
                startDate: new Date(),
                endDate: addDays(new Date(), 7),
                key: 'selection'
                }
            ]
		};

        this.setStartDate = this.setStartDate.bind(this);
        this.openCal = this.openCal.bind(this);
        this.cancelCal = this.cancelCal.bind(this);
        this.saveCal = this.saveCal.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeDate = this.changeDate.bind(this);
	}

    changeDate(item){
        console.log(item);
        this.setState({ dateRange : [item.selection]});
    }

    setStartDate(date){
        console.log(this.state.startDate);
        this.setState({ startDate : date}, function(){
            console.log(date);
            });
    }


      handleSelect(date){
          this.setState( { startDate : date });
  }


    handleOnRequestClose() {
      this.setState({
        open: false
      });
    }

    openCal(event) {
        this.setState( { open : true , anchorEl : event.currentTarget });
        console.log(event.currentTarget);
    }

    cancelCal() {
        this.setState( { open : false });
    }

    saveCal(item) {
        var dateRange = this.state.dateRange;
        this.props.setDateRange(dateRange);
        this.setState( { open : false });
    }

    render() {
        const { daterange } = this.props;
        return (
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" m={2}>
        <Box order={1}>
                <IconButton 
                edge="start"
                onClick={this.openCal}
                >
            <DateRangeIcon id="daterangebutton" />
            <Box ml={1}><Typography color='primary' variant="body2">Date Range.</Typography></Box>
          </IconButton>
                 </Box>

                <div>
      <Popover
          open={this.state.open}
          onRequestClose={this.handleOnRequestClose}
            anchorEl ={this.state.anchorEl}
      >
            <Box display="flex" flexDirection="column">
                <Box m={2} >
                    <Typography >Select date range for MXT Cache and Memory Bins</Typography>
                </Box>
                <Box>
                <DateRangePicker
                      onChange={this.changeDate}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={2}
                      ranges={this.state.dateRange}
                      direction="horizontal"
                    />;
                </Box>
               <Box display="flex" m={2} justifyContent="flex-end">
                <Box>
                <Button flexGrow={4} order={1} variant="contained" color="secondary" onClick={this.cancelCal}>Close</Button>
                </Box>
                <Box>
                <Button order={2} flexGrow={4} variant="contained" onClick={this.saveCal}>Select Range</Button>
                </Box>
                <Box>
                    <p>{daterange}</p>
                </Box>
            </Box>

            </Box>
      </Popover>
    </div>
            
	</Box>
        )
    }
}


const mapStateToProps = state => ({
    dateRange: state.dashboard.dateRange, 
    mxtstream: state.dashboard.mxtstream 
})


const mapDispatchToProps = {
    setDateRange
}

export default connect(mapStateToProps, mapDispatchToProps)(Dates)
