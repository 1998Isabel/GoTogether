import { 
    SET_LOCATION,
    GET_PLACES,
    PLACES_LOADING } from '../actions/types';

const initialState = {
    lacation: null,
    places: [],
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_LOCATION:
            return {
                ...state,
                location: action.payload,
                loading: false
            };
        case GET_PLACES:
            return {
                ...state,
                places: action.payload,
                loading: false
            };
        case PLACES_LOADING:
            return {
                ...state,
                loading: true
            }; 
        default:
            return state;
    }
};