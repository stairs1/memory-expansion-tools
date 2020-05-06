import { SEARCH_MEMORIES, FETCH_MXT_CACHE, SELECT_MEMORY, DELETE_TAG, GET_TAGS, ADD_TAG } from '../actions/types'

const initialState = {
    mapMemories: [],
    searchResults: [], 
    cache: [],
    tags: [], 
    tagBins: {},
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
            let tagBins = {}
            if (action.payload){
                action.payload.forEach(tag => {
                    let bin = []
                    state.cache.forEach(memory => {
                        if (memory.talk.includes(tag))
                            bin.push(memory)
                    })
                    tagBins[tag] = bin
                })
            }            
            return {
                ...state,
                tags: action.payload ? action.payload : [], 
                tagBins
            }
        case ADD_TAG:
            const { tags } = state
            tags.push(action.payload)
            state.tagBins[action.payload] = []
            return {
                ...state,
                tags
            }
        case DELETE_TAG:
            delete state.tagBins[action.payload]
            return {
                ...state,
                tags: state.tags.filter(tag => tag != action.payload)
            }
        default:
            return state
    }
}