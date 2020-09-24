import React, { Component } from 'react';
import MicrophoneStream from 'microphone-stream';
import getUserMedia from 'get-user-media-promise';
import { transcribeHandshake, transcribe, transcribeSubmit } from '../actions/dashboardActions'
import { createBrowserHistory } from 'history'
import { Box, FormControl, TextField, Button, ButtonBase, Typography } from '@material-ui/core';
import MemoryIcon from '@material-ui/icons/Memory';
import { CHUNK_PERIOD, DEFAULT_MICSTREAM_FORMAT } from "../constants";

const history = createBrowserHistory();

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			mic_active: true,
			idx: 0,
			rx_idx: -1,
			session: null,
			transcript: '',
			mic_stream: null
		};
	}
	componentDidUpdate(pprops, pstate) {
		const diff = {
			active: pstate.active !== this.state.active,
			// idx: pprops.idx !== this.props.idx
		};
		if(diff.active && this.state.active) {
			console.log(this.state.active, this.state.mic_stream);
			transcribeHandshake()
				.then(session => this.setState(st => {
					const mic_stream = (() => {
						if(st.mic_stream !== null)
							return st.mic_stream;
						else {
							const mic_stream_ = new MicrophoneStream();
							
							// State machine for windowing data stream
							// may migrate to rx later
							let format = DEFAULT_MICSTREAM_FORMAT;
							let data_chunk = [];
							getUserMedia({ video: false, audio: true })
								.then(function(stream) {
									mic_stream_.setStream(stream);
								}).catch(function(error) {
									console.log(error);
								});
							mic_stream_.on('format', f => { format = f; });
							mic_stream_.on('data', data_ => {
								try {
									if(this.state.mic_active) {
										data_chunk.push.apply(data_chunk, MicrophoneStream.toRaw(data_));
										if(data_chunk.length > format.sampleRate * CHUNK_PERIOD) {
											const data_chunk_stash = data_chunk.map(d => d * (1 << 15));
											data_chunk = [];
											this.setState(({ idx }) => {
												data_chunk_stash.push(idx, this.state.session);
												transcribe(new Int16Array(data_chunk_stash))
													.then(transcript => this.setState(st => {
														if(st.rx_idx < idx)
															return { transcript, rx_idx: idx };
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
					
					return {
						session, mic_stream
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
	handleMicToggle = e => this.setState(({ mic_active }) => ({ mic_active: !mic_active }))
	handleManualEdit = e => this.setState({ transcript: e.target.value })
	handleFormSubmit = e => {
		e.preventDefault();
		transcribeSubmit(this.state.transcript)
			.then(_ => history.go(0)); // refresh on successful submission
	}
	
	render = () => <Box m={2}>
		<Typography variant="h6">
				<MemoryIcon />
				MXT Cache
		</Typography>
		<ButtonBase onClick={this.handleTranscriptToggle} id="toggle_transcribe">{ this.state.active ? 'Stop' : 'Start ' } Transcription</ButtonBase>
		{
			this.state.active
			&& <React.Fragment>
					<ButtonBase onClick={this.handleMicToggle} id="toggle_mic">{ this.state.mic_active ? 'Mute Mic' : 'Unmute Mic' }</ButtonBase>
					<form id="transcribe_form" onSubmit={this.handleFormSubmit}>{/*  method="POST" src={url + transcribeEnd} enctype="application/x-www-form-urlencoded" */}
						<TextField
							multiline={true}
							onChange={this.handleManualEdit}
							value={this.state.transcript}
							/>
						<Button type="submit" id="submit">Submit</Button>
					</form>
				</React.Fragment>
		}
	</Box>
}