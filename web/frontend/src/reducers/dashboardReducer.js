import { SEARCH_MEMORIES, FETCH_MXT_CACHE, SELECT_MEMORY, DELETE_TAG, GET_TAGS, ADD_TAG } from '../actions/types'

const initialState = {
    mapMemories: [],
    searchResults: [], 
    cache: [],
    tags: [], 
    selectedMemory: null 
}

export default function(state = initialState, action){
    switch (action.type){
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
        case GET_TAGS:
            return {
                ...state,
                tags: action.payload 
            }
        case ADD_TAG:
            state.tags.push(action.payload)
            return state
        case DELETE_TAG:
            state.tags.splice(state.tags.findIndex(action.payload), 1)
            return state
        default:
            return state
    }
}