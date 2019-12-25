import axios from 'axios';
import { 
    LOAD_MAP,
    SET_LOCATION,
    GET_PLACES,
    SHOW_PLACE,
    CHANGE_PLACE,
    PLACES_LOADING } from './types';

export const loadMap = map => dispatch => {
    dispatch({
        type: LOAD_MAP,
        payload: map
    })
}

export const setLocation = location => dispatch => {
    dispatch({
        type: SET_LOCATION,
        payload: location
    });
};

export const getPlaces = condition => dispatch => {
    dispatch(setplaceLoading());
    axios
        .get(`/places`, {
            params: {
                location: condition.location,
                hobbies: condition.hobbies,
        }})
        .then(res =>
            dispatch({
                type: GET_PLACES,
                payload: res.data.map(p => {
                    let l = (p.latitude)? [p.latitude,p.longitude]: [0,0]
                    return (
                        {
                            ...p, 
                            latitude: l[0],
                            longitude: l[1],
                            show: false
                        }
                    )
                })
            }));
};

export const showPlace = id => dispatch => {
    dispatch({
        type: SHOW_PLACE,
        payload: id
    })
}

export const changePlace = (c) => dispatch => {
    dispatch({
        type: CHANGE_PLACE,
        payload: c
    })
}

export const setplaceLoading = () => {
    return {
        type: PLACES_LOADING
    };
};