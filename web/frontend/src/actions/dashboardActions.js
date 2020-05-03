import { FETCH_MEMORIES } from './types'; 
import { url, mxtEnd } from "../constants";
import AuthHandle from "../components/AuthHandler";

export const fetchMemories = () => dispatch => { 
    const token = AuthHandle.getToken(); 
    fetch(url + mxtEnd, {
		    method: 'GET',
            headers: {
		        'Accept': 'application/json',
		        'Content-Type': 'application/json',
		        'Authorization': "Bearer " + token
            }
        })
        .then(res => res.json())
        .then(memories => 
            dispatch({
                type: FETCH_MEMORIES,
                payload: memories 
            })
        );
}