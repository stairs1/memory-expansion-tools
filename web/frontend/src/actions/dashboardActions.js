import { FETCH_MEMORIES, SEARCH_MEMORIES, FETCH_MXT_CACHE, SELECT_MEMORY } from './types'; 
import { url, mxtEnd, searchEnd } from "../constants";
import AuthHandle from "../components/AuthHandler";

export const fetchMemories = () => async(dispatch) => { 
    // const token = await AuthHandle.getToken(); 
    // fetch(url + searchEnd, {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + token
	//     },
    //     body: JSON.stringify({ 
    //         'time' : 0, 
    //         'phrases' : [{
    //             'speech' : ''
    //         }]
    //     })
    // })
    // .then(res => res.json())
    // .then(memories => {
    //     dispatch({
    //         type: FETCH_MEMORIES,
    //         payload: memories 
    //     })
    // })
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
    .then(memories => {
        console.log(memories)
        dispatch({
            type: FETCH_MEMORIES,
            payload: memories 
        })
    })
}

export const searchMemories = query => async(dispatch) => {
    const token = await AuthHandle.getToken(); 
    console.log('QUERY' + query)
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
        console.log(searchResults);
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
