import {
    LOAD_MAP,
    SET_LOCATION,
    GET_PLACES,
    RESET_PLACES,
    SHOW_PLACE,
    CHANGE_PLACE,
    PLACES_LOADING
} from '../actions/types';

const initialState = {
    gmap: null,
    places: [],
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOAD_MAP:
            return {
                ...state,
                gmap: action.payload,
                loading: false
            }
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
        case RESET_PLACES:
            return {
                ...state,
                places: action.payload,
                loading: false
            }
        case SHOW_PLACE:
            let newplaces = state.places;
            newplaces.forEach((p, idx) => {
                if (idx === action.payload)
                    newplaces[idx].show = !newplaces[idx].show;
                else
                    newplaces[idx].show = false;
            })
            return {
                ...state,
                places: newplaces,
                loading: false
            };
        case CHANGE_PLACE:
            const { id, lat, lng } = action.payload
            let cplaces = state.places;
            cplaces[id].latitude = lat;
            cplaces[id].longitude = lng;
            return {
                ...state,
                places: cplaces,
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