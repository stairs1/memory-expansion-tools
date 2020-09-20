import React, { Component } from 'react';
//import { MicrophoneStream } from 'microphone-stream';
import { getUserMedia } from 'get-user-media-promise';
import { transcribeHandshake, transcribe, transcribeSubmit } from '../../../actions/dashboardActions'
import { createHistory } from 'react-router'

const history = createHistory();

export default class extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			mic_active: true,
			idx: 0,
			session: null,
			transcript: '',
			mic_stream: null
		};
	}
	onComponentUpdate(pprops, pstate) {
		const diff = {
			active: pstate.active !== this.state.active,
			// idx: pprops.idx !== this.props.idx
		};
		if(diff.active && this.state.active) {
			transcribeHandshake()
				.then(session => this.setState(st => {
					const mic_stream = (() => {
						if(st.mic_stream !== null)
							return st.mic_stream;
						else {
							const mic_stream_ = new MicrophoneStream();

							getUserMedia({ video: false, audio: true })
								.then(function(stream) {
									mic_stream_.setStream(stream);
								}).catch(function(error) {
									console.log(error);
								});
							mic_stream_.on('data', function(data_) {
								if(this.state.mic_active) {
									const data = Array.from(mic_stream_.toRaw(data_)); // Float32
									this.setState(({ idx }) => {
										data.push(idx, this.state.session);
										transcribe(new Int16Array(data))
											.then(transcript => this.setState(st => {
												if(st.idx === idx)
													return { transcript };
											}));
										return { idx: idx + 1 };
									})
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
			&& <Fragment>
					<ButtonBase onClick={this.handleMuteToggle} id="toggle_mic">{ this.state.mic_active ? 'Mute mic' : 'Unmute mic' }</ButtonBase>
					<form id="transcribe_form" onSubmit={this.handleFormSubmit}>{/*  method="POST" src={url + transcribeEnd} enctype="application/x-www-form-urlencoded" */}
						<TextField
							multiline={true}
							onChange={this.handleManualEdit}
							value={this.transcript}
							/>
						<Button type="submit" id="submit">Log In</Button>
					</form>
				</Fragment>
		}
	</Box>
}