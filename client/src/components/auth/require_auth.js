//A higher order component
//Redirects user back to the root route if they are not authenticated

import React, { Component } from 'react';
import { connect } from 'react-redux';

//A function that accepts a component
//The function will add additional functionality to the basic component
export default function(ComposedComponent) {
  class Authentication extends Component {
    //this gives any other component in our application the ability to reference Authentication.contextTypes
    //static creates a property on the class and not an instance of the class
    static contextTypes = {
      router: React.PropTypes.object
    };

    //called whenever the component is about to be rendered
    componentWillMount() {
      if (!this.props.authenticated) {
        this.context.router.push('/');
      }
    }

    //called whenever the component is going to receive new props.
    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.context.router.push('/');
      }
    }

    render() {
      //renders the passed in component, as well as passing through any props suing the spread operator
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }
  //uses connect to gain access to the redux store, so we can tell if the user is logged in or logged out
  return connect(mapStateToProps)(Authentication);
}
