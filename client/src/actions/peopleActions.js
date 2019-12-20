import axios from 'axios';
import { 
    SET_USER,
    GET_FRIENDS,
    FRIENDS_LOADING } from './types';

export const setUser = name => dispatch => {
    dispatch(setFriendsLoading());
    axios
        .get(`/people/${name}`)
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })});
};

export const getFriends = name => dispatch => {
    dispatch(setFriendsLoading());
    axios
        .get(`/people/${name}`)
        .then(res => {
            dispatch({
                type: SET_USER,
                payload: res.data
            })});
    axios
        .get(`/people/${name}`)
        .then(res => 
            dispatch({
                type: GET_FRIENDS,
                payload: res.data
            }));
};

export const setFriendsLoading = () => {
    return {
        type: FRIENDS_LOADING
    };
};