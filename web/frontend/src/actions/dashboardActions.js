import { FETCH_MEMORIES, SEARCH_MEMORIES } from './types'; 
import { url, mxtEnd, searchEnd } from "../constants";
import AuthHandle from "../components/AuthHandler";

export const fetchMemories = () => async(dispatch) => { 
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
    fetch(url + searchEnd, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
	    },
        body: JSON.stringify({ 
            'time' : 0, 
            'phrases' : [{
                'speech' : query
            }]
        })
    })
    .then(res => res.json())
	.then(memories => {
        dispatch({
            type: SEARCH_MEMORIES, 
            payload: memories
        })
    })    
}