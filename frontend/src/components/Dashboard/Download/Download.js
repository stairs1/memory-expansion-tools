import React, { Component } from 'react';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { transcribeHandshake, transcribe, transcribeSubmit, downloadAction } from '../../../actions/dashboardActions'
import { createBrowserHistory } from 'history'
import { Box, FormControl, TextField, Button, ButtonBase, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp'; 
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
			active: false,
			mic_active: false,
			mic_idx: { idx: 0, rx_idx: 0 },
			session: null,
			session_idx: { idx: 0, rx_idx: 0 },
			
			transcript_head: '',
			transcript_buf: '',
			input_pos_stash: null,
			
			mic_stream: null,
		};
		
		this.input_ref = React.createRef();
	}

    downloadFiles(){
        console.log("WE ARE DOWNLODING");
        var info = {};
        info.start = 1999;
        info.end = 2020;
        downloadAction();
        console.log("ALL RUN");
    }

    render = () => <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" m={2}>
        <Box order={1}>
              <IconButton 
                    id="micToggleButton"
                edge="start"
                onClick={this.downloadFiles}
                >
            <GetAppIcon />
            <Typography variant="body2"></Typography>
          </IconButton>
        </Box>
            
        <Box order={2} mr={2}><Typography variant="body2">Download.</Typography></Box>
	</Box>
}
