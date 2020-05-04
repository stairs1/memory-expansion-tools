import { FETCH_MEMORIES, SEARCH_MEMORIES } from '../actions/types'

const initialState = {
    memories: []
}

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_MEMORIES: case SEARCH_MEMORIES:
            return {
                ...state,
                memories: action.payload
            }
        default:
            return state
    }
}