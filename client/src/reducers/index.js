import { combineReducers } from 'redux';
import placeReducer from './placeReducer';
import peopleReducer from './peopleReducer';

export default combineReducers({
    place: placeReducer,
    people: peopleReducer
});