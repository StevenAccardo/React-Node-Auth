import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signin extends Component {
  handleFormSubmit({ email, password }) {
    //calls the action creator, and passes in the user entered data
    this.props.signinUser({ email, password });
  }

  //renders the error message when a user enters the wrong signin/signup information
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div className="form-group">
          <Field className="form-control" name="email" component="input" type="text" placeholder="E-mail" />
        </div>
        <div className="form-group">
          <Field className="form-control" name="password" component="input" type="password" placeholder="Password" />
        </div>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">
          Sign In
        </button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  //pulls the errormessage off of the state object, and makes it available in props
  return { errorMessage: state.auth.error };
}
//assigning reduxForm decorator to our class
Signin = reduxForm({
  form: 'signin'
})(Signin);

//assigning connect, so that we can have access to the action creator via props
Signin = connect(mapStateToProps, actions)(Signin);

export default Signin;
