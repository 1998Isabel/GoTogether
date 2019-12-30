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

export const setUserFromLocation = user => dispatch => {
    dispatch(setFriendsLoading());
    let geocoder = new user.mapApi.maps.Geocoder();
    const addr = user.location[0] + user.location[1];
    geocoder.geocode({ 'address': addr }, (results, status) => {
        if (status == 'OK') {
            let loc = results[0].geometry.location
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

export const setUserFromLatlng = user => dispatch => {
    dispatch(setFriendsLoading());
    let geocoder = new user.mapApi.Geocoder();
    const coord = new user.mapApi.LatLng(user.latlng[0], user.latlng[1])
    geocoder.geocode({ 'latLng': coord }, (results, status) => {
        if (status == 'OK') {
            const resaddrs = results[0].address_components
            let loc = [resaddrs[resaddrs.length-3], resaddrs[resaddrs.length-4]]
            loc = loc.map(l => (
                l.long_name.replace("台","臺")
            ))
            console.log("GET ADDR", loc)
            dispatch({
                type: SET_USER,
                payload: {
                    name: user.name,
                    hobbies: user.hobbies,
                    location: loc,
                    latlng: user.latlng
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