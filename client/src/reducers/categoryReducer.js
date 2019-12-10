import { 
    GET_CATEGORIES, 
    ADD_CATEGORY, 
    DELETE_CATEGORY, 
    CATEGORIES_LOADING } from '../actions/types';

const initialState = {
    categories: [],
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                loading: false
            };
        case ADD_CATEGORY:
            return {
                ...state,
                categories: [action.payload, ...state.categories]
            };
        case DELETE_CATEGORY:
            return {
                ...state,
                posts: state.posts.filter(category => category.id !== action.payload)
            };  
        case CATEGORIES_LOADING:
            return {
                ...state,
                loading: true
            }; 
        default:
            return state;
    }
};