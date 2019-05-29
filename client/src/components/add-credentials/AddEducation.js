import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { TextFieldGroup } from "../common/TextFieldGroup";
import { TextAreaFieldGroup } from "../common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class AddEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: "",
      fieldofstudy: "",
      degree: "",
      from: "",
      to: "",
      current: false,
      description: "",
      errors: {},
      disabled: false
    };
  }
  render() {
    const { errors } = this.state;

    return (
      <div className="add-experience">
        <div className="container">
          <div className="row">
            <div className="cole-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">Back</Link>
              <h1 className="display-4 text-center">Add Education</h1>
              <p className="lead text-center">Add any education background that you have completed in the past, or add schooling that you currently are attending.</p>
              <small className="d-block pb-3">* = Required Fields</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddEducation.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect()(withRouter(AddEducation));
