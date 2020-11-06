import React, { Component } from 'react';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { transcribeHandshake, transcribe, transcribeSubmit } from '../../../actions/dashboardActions'
import { createBrowserHistory } from 'history'
import { Box, FormControl, TextField, Button, ButtonBase, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import { CHUNK_PERIOD, TARGET_TRANSCRIBE_RATE } from '../../../constants/index';

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
		if((diff.active || diff.mic_active) && this.state.active && this.state.mic_active) {
			console.log(this.state.active, this.state.mic_stream);
			this.setState(({ session_idx }) => {
				const stash_idx = session_idx.idx + 1;
				transcribeHandshake()
					.then(session => this.setState(st => {
						if(st.session_idx.rx_idx <= stash_idx) {
							const mic_stream = st.mic_stream || this.mk_mic_stream();
							return {
								session: session.session_id,
								mic_stream,
								session_idx: Object.assign(st.session_idx, { rx_idx: stash_idx }) // also possibly st.session_idx.idx since the responses are delayed anyways so the mic start timing isn't really critical. `stash_idx` as it is now is just clearer.
							};
						}
					}));
				return { session_idx: Object.assign(session_idx, { idx: stash_idx }) }; // increment request idx
			});
		}
	}
	mk_mic_stream() {
		const mic_stream_ = new MicrophoneStream();
		
		// [STATE MACHINE]
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
				if(this.state.mic_active && this.state.session_idx.rx_idx === this.state.session_idx.idx) {
					// second check is to make sure that there's no ongoing pending session ID requests
					// TODO may want to delay view changes until after the session ID is resolved (or error'd)
					data_chunk.push.apply(data_chunk, MicrophoneStream.toRaw(data_));
					if(data_chunk.length > format.sampleRate * CHUNK_PERIOD) {
						const data_chunk_stash = [];
						for(let i = 0.0; i < data_chunk.length; i += format.sampleRate / TARGET_TRANSCRIBE_RATE) {
							data_chunk_stash.push(data_chunk[parseInt(i)] * (1 << 15));
						}
						// const data_chunk_stash = data_chunk.map(d => d * (1 << 15)).filter((_, i));
						data_chunk = [];
						this.setState(({ mic_idx }) => {
							const stash_idx = mic_idx.idx + 1;
							data_chunk_stash.push(mic_idx.idx, this.state.session);
							transcribe(new Int16Array(data_chunk_stash))
								.then(transcript_response => this.setState(st => {
									if(st.mic_idx.rx_idx <= stash_idx && this.state.mic_active) //have to check again if the mic is active, as some transcriptions come in after a delay , i.e. after the mix is inactive
										return {
											transcript_buf : transcript_response.transcript,
											mic_idx: Object.assign(st.mic_idx, { rx_idx: stash_idx })
										};
								}));
							return { mic_idx: Object.assign(mic_idx, { idx: stash_idx }) };
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
	handleMicToggle = e => this.setState(({ active, input_pos_stash, mic_active, transcript_buf, transcript_head, mic_stream }) => {
		let next_input_pos = input_pos_stash;
		let next_transcript_buf = transcript_buf;
		let next_transcript_head = transcript_head;
		switch(mic_active) {
			case true:
				if(mic_stream !== null) {
					mic_stream.stop();
				}
				next_transcript_buf = '';
                //if we are turning off transcrption, we want to add a space to the end so user can start typing easily
				next_transcript_head = str_splice(transcript_head, transcript_buf + ' ', input_pos_stash);
				next_input_pos += transcript_buf.length + 1; //+1 for the space added at the end
				break;
			case false:
				// mic about to go live: stash current position
				next_input_pos = this.input_ref.current.selectionStart;
				break;
		}
		return {
			mic_active: !mic_active,
			transcript_buf: next_transcript_buf,
			transcript_head: next_transcript_head,
			input_pos_stash: next_input_pos,
			active: !active,
			mic_stream: active ? null : mic_stream
		};
	})
	get_transcript = () => 
		this.state.mic_active
			? str_splice(this.state.transcript_head || '', this.state.transcript_buf, this.state.input_pos_stash)
			: this.state.transcript_head
	handleManualEdit = e => this.setState({ transcript_head: e.target.value })
	handleFormSubmit = e => {
		e.preventDefault();
		transcribeSubmit(this.get_transcript() + " MXT")
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
                                onKeyPress={(ev) => {
                                if (ev.key === 'Enter' & !ev.shiftKey) {
                                  // Do code here
                                  console.log("ENTERPRESSED");
                                    this.handleFormSubmit(ev);
                                }
                              }}
							disabled={this.state.mic_active}
							inputRef={this.input_ref}
							multiline={true}
							onChange={this.handleManualEdit}
                            fullWidth={true}
							value={this.get_transcript()}
							/>
                        <Box ml={2}>
						<Button type="submit" id="submit" variant="contained">Submit</Button>
                        </Box>
					</form>
                </Box>
	</Box>
}
