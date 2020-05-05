import { SEARCH_MEMORIES, FETCH_MXT_CACHE, SELECT_MEMORY, GET_TAGS, ADD_TAG, DELETE_TAG } from './types'; 
import { url, mxtEnd, searchEnd, tagEnd } from "../constants";
import AuthHandle from "../components/AuthHandler";

export const searchMemories = query => async(dispatch) => {
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

export const fetchMXTCache = () => async(dispatch) => { 
    const token = await AuthHandle.getToken(); 
    fetch(url + mxtEnd, {
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

export const selectMemory = memory => dispatch => {
    dispatch({
        type: SELECT_MEMORY, 
        payload: memory
    })
}

export const getTags = () => async(dispatch) => {
    const token = await AuthHandle.getToken(); 
    fetch(url + tagEnd, {
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
    })   
}