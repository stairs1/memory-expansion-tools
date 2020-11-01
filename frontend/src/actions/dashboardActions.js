import { SEARCH_MEMORIES, FETCH_MXT_CACHE, SET_MXT_STREAM, SET_DATE_RANGE ,SELECT_MEMORY, GET_TAGS, ADD_TAG, DELETE_TAG } from './types'; 
import { url, mxtEnd, searchEnd, tagEnd, transcribeEnd, newNoteEnd, downloadEnd } from "../constants";
import AuthHandle from "../components/AuthHandler";

export const searchMemories = query => async(dispatch) => {
    console.log("DDDDDDDDDDDDDAAAAAAAAAAAAAAAAA");
    const token = await AuthHandle.getToken()
    fetch(url + searchEnd, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
	    },
        body: JSON.stringify({ 
            'phrases' : [{
                'speech' : query
            }]
        })
    })
    .then(res => res.json())
	.then(searchResults => {
        dispatch({
            type: SEARCH_MEMORIES, 
            payload: searchResults
        })
    })    
}

export const fetchMXTCache = (startDate, endDate) => async(dispatch) => { 
    const token = await AuthHandle.getToken()
    console.log("FROM MXT CAHCE" + startDate + endDate);
    console.log(token)
    fetch(url + mxtEnd + "?" + new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
        }), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(cache => {
        dispatch({
            type: FETCH_MXT_CACHE,
            payload: cache 
        })
    })
}

export const setMXTStream = mxtstream => async(dispatch) => { 
    console.log("SETTTING");
    dispatch({
        type: SET_MXT_STREAM,
        payload: mxtstream 
    })
}

export const setDateRange = dateRange => async(dispatch) => { 
    console.log("SETTTING DATE RANGE");
    console.log(dateRange);
    dispatch({
        type: SET_DATE_RANGE,
        payload: dateRange 
    })
}

export const transcribeHandshake = async () => {
    const token = ''; // await AuthHandle.getToken()
    function handshake_() {
        return fetch(url + transcribeEnd, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            mode: 'cors',
        })
        .then(r => r.json())
    }
    return await handshake_();
}

const TRANSCRIBE_RETRIES = 8;
export const transcribe = async (A) => {
    const token = ''; // await AuthHandle.getToken()
    function transcribe_(i) {
        return fetch(url + transcribeEnd, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/octet-stream',
                'Authorization': "Bearer " + token
            },
            mode: 'cors',
            body: A
        })
        .then(r => r.json(), e => {
            if(i < TRANSCRIBE_RETRIES)
                return transcribe_(i + 1);
            else throw e
        });
    }
    return await transcribe_(0);
}

export const transcribeSubmit = async (transcript) => {
    const token = await AuthHandle.getToken()
    return await fetch(url + newNoteEnd, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify({
            type: 'phrase',
            phrases: [{"speech": transcript, "timestamp": Date.now()}]
            // loc fields omitted for now: lat, long, address
        })
    });
}

export const selectMemory = memory => dispatch => {
    dispatch({
        type: SELECT_MEMORY, 
        payload: memory
    })
}

export const getTags = (startDate, endDate) => async(dispatch) => {
    const token = await AuthHandle.getToken(); 
    fetch(url + tagEnd + "?" + new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
        }), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(data => {
        const { tags } = data
        dispatch({
            type: GET_TAGS,
            payload: tags 
        })
    })
}

export const deleteTag = tag => async(dispatch) => {
    const token = await AuthHandle.getToken()
    fetch(url + tagEnd, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
	    },
        body: JSON.stringify({ 
            tag,
            'remove': 1 
        })
    })
	.then(res => {
        dispatch({
            type: DELETE_TAG, 
            payload: tag
        })
    })   
}

export const createTag = tag => async(dispatch) => {
    const token = await AuthHandle.getToken()
    fetch(url + tagEnd, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
	    },
        body: JSON.stringify({ 
            tag
        })
    })
	.then(res => {
        dispatch({
            type: ADD_TAG, 
            payload: tag
        })
        getTags()
    })   
}

export const downloadAction = async (startDate, endDate) => {
    var start = 1999; //info.start;
    var end = 2020; //info.end;
    var saveAs = require('file-saver');
    const token = await AuthHandle.getToken()
    fetch(url + downloadEnd + "?" + new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
        }), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
	    },
    })
	.then(res => {
        const filename = res.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim().replace(/"/g, "");
        console.log(filename);
        res.blob().then(blob => saveAs(blob, filename)); 
    }
    )
}
