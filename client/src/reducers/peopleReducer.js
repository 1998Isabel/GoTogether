import { 
    SET_USER,
    GET_FRIENDS,
    FRIENDS_LOADING } from '../actions/types';

const initialState = {
    user: null,
    friends: [],
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                friends: [],
                loading: false
            };
        case GET_FRIENDS:
            return {
                ...state,
                friends: action.payload,
                loading: false
            };
        case FRIENDS_LOADING:
            return {
                ...state,
                loading: true
            }; 
        default:
            return state;
    }
};