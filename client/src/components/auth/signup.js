import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class Signup extends Component {
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  handleFormSubmit(props) {
    this.props.signupUser(props);
  }

  renderComponent({ meta: { error, touched }, input, placeholder, type }) {
    return (
      <div>
        <input {...input} type={type} placeholder={placeholder} className="form-control" />
        <div className="text-danger">{touched && error}</div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div className="form-group">
          <Field name="email" type="input" component={this.renderComponent} placeholder="E-mail" />
        </div>
        <div className="form-group">
          <Field name="password" type="password" component={this.renderComponent} placeholder="Password" />
          {}
        </div>
        <div className="form-group">
          <Field name="passwordConfirm" type="password" component={this.renderComponent} placeholder="Confirm Password" />
        </div>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Please enter an e-mail.';
  }
  if (!values.password) {
    errors.password = 'Please enter a password.';
  }
  if (!values.passwordConfirm) {
    errors.passwordConfirm = 'Please re-enter your password.';
  }

  if (values.passwordConfirm && values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match.';
  }

  return errors;
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

Signup = reduxForm({
  form: 'signup',
  validate
})(Signup);

Signup = connect(mapStateToProps, actions)(Signup);

export default Signup;
