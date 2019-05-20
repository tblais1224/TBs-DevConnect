import React, { Component } from "react";
import axios from "axios"
import classnames from "classnames"


class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  onChange = (e) => {
    //this setState for the name of the target (email, password), then sets it to the value of the event target
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    //prevent auto reload on form submit
    e.preventDefault()

    //this is the same as whats in login route backend api
    const user = {
      email: this.state.email,
      password: this.state.password,
    }
    //sends post to the proxy plus route below
    axios.post("/api/users/login", user)
    .then(res => console.log(res.data))
    //console logs the data from the error response
    .catch(err => this.setState({errors: err.response.data}))
  };

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">
                Sign in to your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
