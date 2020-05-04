import { FETCH_MEMORIES, SEARCH_MEMORIES, FETCH_MXT_CACHE } from '../actions/types'

const initialState = {
    memories: [],
    cache: [] 
}

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_MEMORIES: case SEARCH_MEMORIES:
            return {
                ...state,
                memories: action.payload
            }
        case FETCH_MXT_CACHE:
            return {
                ...state,
                cache: action.payload
            }
        default:
            return state
    }
}