import React, { Component } from "react";
//lets us call Router and it will be BrowserRouter
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

import "./App.css";

//check for login token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //decode the token to get user info and the experation time
  const decoded = jwt_decode(localStorage.jwtToken)
  //set user and isAuth
  store.dispatch(setCurrentUser(decoded))
  //check if token is expired
  const currentTime = Date.now()/1000
  if(decoded.exp < currentTime){
    //Logout User
    store.dispatch(logoutUser())
    //clear profile
    store.dispatch(clearCurrentProfile())

    // redirect to login page after logout
    window.location.href = "/login"
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
