import { FETCH_MEMORIES } from './types'; 

export const fetchMemories = () => dispatch => { 
    fetch('some url')
        .then(res => res.json())
        .then(memories => 
            dispatch({
                type: FETCH_MEMORIES,
                payload: memories 
            })
        );
}