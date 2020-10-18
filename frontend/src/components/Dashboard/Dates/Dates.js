import React, { Component, useState } from 'react';
import { addDays } from 'date-fns';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { saveDate, transcribeHandshake, transcribe, transcribeSubmit, downloadAction } from '../../../actions/dashboardActions'
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

export default class extends Component {
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
        this.closeCal = this.closeCal.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeDate = this.changeDate.bind(this);
	}

    changeDate(item){
        console.log(item);
        this.setState({ dateRange : [item.selection]});
    }

    downloadFiles(){
        console.log("WE ARE DOWNLODING");
        var info = {};
        info.start = 1999;
        info.end = 2020;
        downloadAction();
        console.log("ALL RUN");
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
        this.setState( { open : true }); //, anchorEl : event.currentTarget });
        console.log(event.currentTarget);
    }

    closeCal() {
        this.setState( { open : false });
    }


    render() {

        return (
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" m={2}>
        <Box order={1}>
                <IconButton 
                    id="micToggleButton"
                edge="start"
                onClick={this.openCal}
                >
            <DateRangeIcon id="daterangebutton" />
            <Typography variant="body2"></Typography>
          </IconButton>
                 </Box>

                <div>
      <Popover
          open={this.state.open}
          onRequestClose={this.handleOnRequestClose}
            anchorEl ={this.state.anchorEl}
      >
            <Box display="flex" flexDirection="column">
            <Button onClick={this.closeCal}>Close</Button>
            <DateRangePicker
                  onChange={this.changeDate}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={this.state.dateRange}
                  direction="horizontal"
                />;

            </Box>
      </Popover>
    </div>
            
        <Box order={2} mr={2}><Typography variant="body2">Download.</Typography></Box>
	</Box>
        )
    }
}


          //anchorEl={"hello}
