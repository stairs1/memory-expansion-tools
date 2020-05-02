import { FETCH_MEMORIES } from '../actions/types'; 

const initialState = {
    memories: []
};

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_MEMORIES:
            return {
                ...state,
                memories: action.payload
            }; 
        default:
            return state; 
    }
}