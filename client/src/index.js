import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import Signup from './components/auth/signup';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Feature from './components/feature';
import Landing from './components/landing';
import RequireAuth from './components/auth/require_auth';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';

//reduxthunk added to middlware flow
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
//declare the store before hand, so that you can change the authentication flag if the user had signed in before, then you pass the store after the check and update have been made.
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
//If there is a token, condsider the user to be signed in
if (token) {
  // Update application state
  //use the dispatch method to send out an action, that will run through all of the reducers, in this case AUTH_USER will flip the authenticated state to true.
  store.dispatch({ type: AUTH_USER });
}

ReactDOM.render(
  //variable store is passed in AFTER checking for the JWT to check if the user is logged in or not.
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/* An indexRoute is used whenever the user hits a url, that we have not already set up a route for, such as the ones below. */}
        <IndexRoute component={Landing} />
        <Route path="signup" component={Signup} />
        <Route path="signin" component={Signin} />
        <Route path="signout" component={Signout} />
        {/* You can wrap any component with your hoc in order to provide that component with the hoc functionality. In this case it will make the wrapped component a protected component that the user can only visit if authenticated. */}
        <Route path="feature" component={RequireAuth(Feature)} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.container')
);
