import { SEARCH_MEMORIES, FETCH_MXT_CACHE, SET_MXT_STREAM, SET_DATE_RANGE, SELECT_MEMORY, DELETE_TAG, GET_TAGS, ADD_TAG } from '../actions/types'
import { omit } from 'lodash'

const initialState = {
    mxtstream: [],
    dateRange: [],
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
        case SET_MXT_STREAM:
             return {
                ...state,
                mxtstream: action.payload
            }
        case SET_DATE_RANGE:
             return {
                ...state,
                dateRange: action.payload
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
                tagBins: Object.assign({}, state.tagBins, tagBins)
            }
        case ADD_TAG:
            let tagBinsObject = {}
            tagBinsObject[action.payload] = state.cache.filter(memory => memory.talk.includes(action.payload))
            return {
                ...state,
                tags: [...state.tags, action.payload],
                tagBins: Object.assign({}, state.tagBins, tagBinsObject)
            }
        case DELETE_TAG:
            return {
                ...state,
                tags: state.tags.filter(tag => tag != action.payload),
                tagBins: omit(state.tagBins, action.payload)
            }
        default:
            return state
    }
}
