import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import { createProfile } from "../../actions/profileActions";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      displaySocialInputs: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    //grab errors from state
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;
    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter Profile URL"
            name="twitter"
            //font awsome
            icon="fab fa-twitter"
            onChange={this.onChange}
            error={errors.twitter}
          />
          <InputGroup
            placeholder="LinkedIn Profile URL"
            name="linkedin"
            //font awsome
            icon="fab fa-linkedin"
            onChange={this.onChange}
            error={errors.linkedin}
          />
          <InputGroup
            placeholder="Instagram Profile URL"
            name="instagram"
            //font awsome
            icon="fab fa-instagram"
            onChange={this.onChange}
            error={errors.instagram}
          />
          <InputGroup
            placeholder="Facebook Profile URL"
            name="facebook"
            //font awsome
            icon="fab fa-facebook"
            onChange={this.onChange}
            error={errors.facebook}
          />
          <InputGroup
            placeholder="Youtube Profile URL"
            name="youtube"
            //font awsome
            icon="fab fa-youtube"
            onChange={this.onChange}
            error={errors.youtube}
          />
        </div>
      );
    }

    //select options for a status on your profile
    const options = [
      { label: "Select Professional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: 'Student and/or "Learning"', value: "Student and/or Learning" },
      { label: "Intern", value: "Intern" },
      {
        label: "Teacher and/or Instructor",
        value: "Teacher and/or Instructor"
      },
      { label: "Other", value: "Other" }
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Please enter as much information about yourself as you wish!
              </p>
              <small className="d-block pb-3">* = Required Fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="Please use either you full name, or nickname for your handle as this will be used to identify you via profile url."
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  error={errors.status}
                  options={options}
                  info="Let us know where you are at in your current developer career."
                />
                <TextFieldGroup
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Add the company you currently work for, have worked for, or own."
                />
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="Enter the city and state you work in. (Providence, RI)"
                />
                <TextFieldGroup
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Enter your developer skills using comma seperated values, such as, HTML,CSS,JavaScript."
                />
                <TextFieldGroup
                  placeholder="Github Username"
                  name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  error={errors.githubusername}
                  info="Enter your Github username to display your repositories in your profile."
                />
                <TextAreaFieldGroup
                  placeholder="Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Enter a bio about yourself."
                />
                <div className="mb-3">
                  <button
                  type="button"
                    className="btn btn-light"
                    // the social media display will be toggled with this button
                    onClick={() =>
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }))
                    }
                  >
                    Add Social Networking Accounts
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile }
)(withRouter(CreateProfile));
