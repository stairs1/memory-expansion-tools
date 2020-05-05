import { FETCH_MEMORIES, SEARCH_MEMORIES, FETCH_MXT_CACHE, SELECT_MEMORY } from '../actions/types'

const initialState = {
    mapMemories: [],
    searchResults: [], 
    cache: [],
    selectedMemory: null 
}

export default function(state = initialState, action){
    switch (action.type){
        case FETCH_MEMORIES:
            return {
                ...state,
                mapMemories: action.payload
            }
        case FETCH_MXT_CACHE:
            return {
                ...state,
                cache: action.payload
            }
        case SEARCH_MEMORIES:
            return {
                ...state,
                searchResults: action.payload
            }
        case SELECT_MEMORY:
            return {
                ...state,
                selectedMemory: action.payload
            }
        default:
            return state
    }
}