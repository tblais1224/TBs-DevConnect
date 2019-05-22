import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// ...rest is spread operator
//The rest parameter syntax allows us to represent an indefinite number of arguments as an array.
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
        //if auth is true that means logged and component will render
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
          //if not logged in redirect to login
        <Redirect to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
