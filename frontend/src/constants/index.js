//these are the constants we want to use around the app

//export const url = "https://memoryexpansiontools.com"
//export const mxtEnd = "/api/ltwo"
//export const loginEnd = "/api/loginapi"
//export const refreshEnd = "/api/refresh"
//export const signupEnd = "/api/signupapi"
//export const searchEnd = "/api/searchapi"

//the below are used for testing locally. I have tried to get some proxying working so that we don't have to do this, but no luck
export const url = "http://localhost:5000"
export const mxtEnd = "/ltwo"
export const tagEnd = "/tag"
export const loginEnd = "/loginapi"
export const refreshEnd = "/refresh"
export const signupEnd = "/signupapi"
export const searchEnd = "/searchapi"
export const newNoteEnd = '/remember'
export const transcribeEnd = '/transcribe'
export const downloadEnd = '/download'
// Google Maps API Key 
export const API_KEY = 'AIzaSyDrF-e0TO_qHQ1HTokpiZlHSarRz2mlnds'

// transcription options
export const CHUNK_PERIOD = 1.2;
export const DEFAULT_MICSTREAM_FORMAT = { channels: 1, bitDepth: 32, sampleRate: 44100, signed: true, float: true };
