import axios from 'axios';
import {
    SET_USER,
    GET_FRIENDS,
    FRIENDS_LOADING,
    RESET_PLACES,
} from './types';

export const setUser = user => dispatch => {
    dispatch(setFriendsLoading());
    axios
        .get(`/people/${user.name}`)
        .then(res => {
            let geocoder = new user.mapApi.maps.Geocoder();
            const addr = res.data.location[0] + res.data.location[1];
            console.log("ADDR", addr)
            geocoder.geocode({ 'address': addr }, (results, status) => {
                if (status == 'OK') {
                    let loc = results[0].geometry.location
                    dispatch({
                        type: SET_USER,
                        payload: { ...res.data, latlng: [loc.lat(), loc.lng()] }
                    })
                    dispatch({
                        type: RESET_PLACES,
                        payload: []
                    })
                }
                else {
                    console.log(status)
                    dispatch({
                        type: SET_USER,
                        payload: res.data
                    })
                    dispatch({
                        type: RESET_PLACES,
                        payload: []
                    })
                }
            })
        });
}

export const setUserLocation = user => dispatch => {
    dispatch(setFriendsLoading());
    if (user.mapApi) {
        console.log("HAVE LOCATION", user)
        let geocoder = new user.mapApi.maps.Geocoder();
        const addr = user.location[0] + user.location[1];
        console.log("ADDR", addr)
        geocoder.geocode({ 'address': addr }, (results, status) => {
            if (status == 'OK') {
                let loc = results[0].geometry.location
                console.log("!!!", loc)
                dispatch({
                    type: SET_USER,
                    payload: {
                        name: user.name,
                        hobbies: user.hobbies,
                        location: user.location,
                        latlng: [loc.lat(), loc.lng()]
                    }
                })
            }
            else {
                console.log(status)
                dispatch({
                    type: SET_USER,
                    payload: {
                        name: user.name,
                        hobbies: user.hobbies,
                        location: user.location,
                        latlng: user.latlng
                    }
                })
            }
        })
    }
    else {
        dispatch({
            type: SET_USER,
            payload: user
        })
    }
}

export const getFriends = name => dispatch => {
    dispatch(setFriendsLoading());
    axios
        .get(`/friends/${name}`)
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