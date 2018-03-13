//uses redux-thunk
//submits login info to API server and DB.

import axios from 'axios';
//browserHistory communicates the url to ReactRouter, and it can also change the URL, which is how we will use it here.
import { browserHistory } from 'react-router';
import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  //dispatch accepts an action and forwards it to all of the different reducers that we have in our application
  //redux-thunk allows us to return functions instead of objects and it allows one action creator to send multiple actions at a time.
  //action creators are synchronous by default, redux-thunk is asynchronous
  //When the action creator is called, it will immediately return a function, which redux thunk is going to call while passing in the dispatch method.
  return function(dispatch) {
    //submit email/password to our API server
    axios
      .post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        //if request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        //localStorage is available on the window scope
        //it allows us to store info on the users computer
        //even if the user leaves the app, they will still have the JWT saved
        //setItem saves something to localStorage
        localStorage.setItem('token', response.data.token);
        // - Redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  };
}

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios
      .post(`${ROOT_URL}/signup`, { email, password })
      .then(response => {
        //if request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        //localStorage is available on the window scope
        //it allows us to store info on the users computer
        //even if the user leaves the app, they will still have the JWT saved
        //setItem saves something to localStorage
        localStorage.setItem('token', response.data.token);
        // - Redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(error => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError(error.response.data.error));
      });
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  //removes the JWT from the user's localStorage
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, { headers: { authorization: localStorage.getItem('token') } }).then(response => {
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.message
      });
    });
  };
}
