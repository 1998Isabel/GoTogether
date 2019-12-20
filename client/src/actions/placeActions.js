import axios from 'axios';
import { 
    SET_LOCATION,
    GET_PLACES,
    PLACES_LOADING } from './types';

export const setLocation = location => dispatch => {
    dispatch(setplaceLoading());
    dispatch({
        type: SET_LOCATION,
        payload: location
    });
};

export const getPlaces = condition => dispatch => {
    axios
        .get('/places', condition)
        .then(res => 
            dispatch({
                type: GET_PLACES,
                payload: res.data
            }));
};

export const setplaceLoading = () => {
    return {
        type: PLACES_LOADING
    };
};