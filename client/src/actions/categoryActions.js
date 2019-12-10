import axios from 'axios';
import { 
    GET_CATEGORIES, 
    ADD_CATEGORY, 
    DELETE_CATEGORY, 
    CATEGORIES_LOADING } from './types';

export const getCategories = () => dispatch => {
    dispatch(setCategoriesLoading());
    axios
        .get('/categories')
        .then(res => {
            // console.log(res.data)
            dispatch({
                type: GET_CATEGORIES,
                payload: res.data
            })});
};

export const addCategory = category => dispatch => {
    axios
        .post('/categories', category)
        .then(res => 
            dispatch({
                type: ADD_CATEGORY,
                payload: res.data
            }));
};

export const deleteCategory = id => dispatch => {
    axios.delete(`/categories/${id}`)
        .then(res => 
            dispatch({
                type: DELETE_CATEGORY,
                payload: id
            }));
};

export const setCategoriesLoading = () => {
    return {
        type: CATEGORIES_LOADING
    };
};