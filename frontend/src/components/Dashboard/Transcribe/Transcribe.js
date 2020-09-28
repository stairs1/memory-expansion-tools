import React, { Component } from 'react';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { transcribeHandshake, transcribe, transcribeSubmit } from '../../../actions/dashboardActions'
import { createBrowserHistory } from 'history'
import { Box, FormControl, TextField, Button, ButtonBase, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';

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

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			mic_active: false,
			idx: 0,
			rx_idx: -1,
			session: null,
			
			transcript: '',
			transcript_buf: '',
			input_pos_stash: null,
			
			mic_stream: null,
		};
		
		this.input_ref = React.createRef();
	}
	componentDidUpdate(pprops, pstate) {
		const diff = {
			active: pstate.active !== this.state.active,
			mic_active: pstate.mic_active !== this.state.mic_active,
			// idx: pprops.idx !== this.props.idx
		};
		// if(diff.mic_active) {
		// 	switch(this.props.mic_active) {
		// 		case true:
		// 			// stash cursor position
		// 			this.setState();
		// 			break;
		// 		case false:
		// 			break;
		// 	}
		// }
		if(diff.mic_active && !this.state.mic_active && this.state.input_pos_stash !== null) {
			// this is invoked after render, the input should be back to enabled
			// restore caret position plus the previous transcript length
			console.log(this.state.input_pos_stash);
			setCaretPosition(this.input_ref.current, this.state.input_pos_stash)
			this.setState({ input_pos_stash: null });
		}
		if(diff.active && this.state.active) {
			console.log(this.state.active, this.state.mic_stream);
			transcribeHandshake()
				.then(session => this.setState(st => {
					const mic_stream = (() => {
						if(st.mic_stream !== null)
							return st.mic_stream;
						else {
							const mic_stream_ = new MicrophoneStream();
							
							// [STATE MACHINE]
							const CHUNK_PERIOD = 1.2; // # seconds per chunk
							let format = { channels: 1, bitDepth: 32, sampleRate: 44100, signed: true, float: true };
							let data_chunk = [];
							getUserMedia({ video: false, audio: true })
								.then(function(stream) {
									mic_stream_.setStream(stream);
								}).catch(function(error) {
									console.log(error);
								});
							mic_stream_.on('format', f => { console.log(f); format = f; });
							mic_stream_.on('data', data_ => {
								try {
									if(this.state.mic_active) {
										// console.log(Array.from(MicrophoneStream.toRaw(data_)).reduce((a, b) => Math.max(a, Math.abs(b)), 0));
										data_chunk.push.apply(data_chunk, MicrophoneStream.toRaw(data_));
										if(data_chunk.length > format.sampleRate * CHUNK_PERIOD) {
											const data_chunk_stash = data_chunk.map(d => d * (1 << 15));
											data_chunk = [];
											this.setState(({ idx }) => {
												data_chunk_stash.push(idx, this.state.session);
												transcribe(new Int16Array(data_chunk_stash))
													.then(transcript_response => this.setState(st => {
														if(st.rx_idx < idx)
															return { transcript_buf : transcript_response.transcript, rx_idx: idx };
													}));
												return { idx: idx + 1 };
											})
										}
									}
									// mic_stream_.stop() // TEMP
								}
								catch(e) {
									mic_stream_.stop()
									throw e;
								}
							});
							return mic_stream_;
						}
					})();
                    console.log(session);
					
					return {
                        session: session.session_id, mic_stream
					};
				}));
		}
	}
	handleTranscriptToggle = e => this.setState(({ active, mic_stream }) => {
		if(active && mic_stream !== null) {
			mic_stream.stop();
		}
		return {
			active: !active,
			mic_stream: active ? null : mic_stream,
			mic_active: true
		};
	})
	handleMicToggle = e => this.setState(({ active, input_pos_stash, mic_active, transcript_buf, transcript, mic_stream }) => {
		let next_input_pos = input_pos_stash;
		let next_transcript_buf = transcript_buf;
		let next_transcript = transcript;
		switch(mic_active) {
			case true:
                if(mic_stream !== null) {
                    mic_stream.stop();
                }
                mic_stream.stop();
				next_transcript_buf = '';
				next_transcript =
					transcript.slice(0, input_pos_stash || undefined)
					+ transcript_buf
					+ transcript.slice(input_pos_stash || Infinity);
				next_input_pos += transcript_buf.length;
				break;
			case false:
				// mic about to go live: stash current position
				next_input_pos = this.input_ref.current.selectionStart;
				console.log(next_input_pos)
				break;
		}
		return {
			mic_active: !mic_active,
			transcript_buf: next_transcript_buf,
			transcript: next_transcript,
			input_pos_stash: next_input_pos,
			active: !active,
			mic_stream: active ? null : mic_stream
		};
	})
	handleManualEdit = e => this.setState({ transcript: e.target.value })
	handleFormSubmit = e => {
		e.preventDefault();
		transcribeSubmit(this.state.transcript + " MXT")
			.then(_ => history.go(0)); // refresh on successful submission
	}
	
    formContainer = {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    };

	render = () => <Box display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" m={2}>
        <Box order={1}>
              <IconButton 
                    id="micToggleButton"
                color={this.state.active ? "secondary" : "primary"}
                edge="start"
                onClick={this.handleMicToggle}
                >
            <MicIcon />
            <Typography variant="body2"></Typography>
          </IconButton>
        </Box>
            
        <Box order={2} mr={2}><Typography variant="body2">Click to transcribe.</Typography></Box>

                <Box mr={2} flexGrow={8} order={4}>
					<form id="transcribe_form" style={this.formContainer} onSubmit={this.handleFormSubmit}>{/*	method="POST" src={url + transcribeEnd} enctype="application/x-www-form-urlencoded" */}
						<TextField
							disabled={this.state.mic_active}
							inputRef={this.input_ref}
							multiline={true}
							onChange={this.handleManualEdit}
                            fullWidth={true}
							value={
								this.state.transcript.slice(0, this.state.input_pos_stash || undefined)
								+ (this.state.transcript_buf || '')
								+ this.state.transcript.slice(this.state.input_pos_stash || Infinity)}
							/>
                        <Box ml={2}>
						<Button type="submit" id="submit" variant="contained">Submit</Button>
                        </Box>
					</form>
                </Box>
	</Box>
}
