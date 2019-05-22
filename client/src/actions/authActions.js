import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register User
export const registerUser = (userData, history) => dispatch => {
  // sends post to the proxy plus route below
  axios
    .post("/api/users/register", userData)
    //redirect to route /login after register
    .then(res => history.push("/login"))
    //console logs the data from the error response
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login user and get auth token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //save token to localstorage
      const { token } = res.data;
      //set the token to localstorage (localstorage only stores string)
      localStorage.setItem("jwtToken", token);
      //set token to the auth header
      setAuthToken(token);
      //decode the token to get the users data
      const decoded = jwt_decode(token);
      //set the current user from decoded
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set the logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//log user out
export const logoutUser = () => dispatch => {
    //remove the toekn from localstorage
    localStorage.removeItem("jwtToken")
    // delete the authentication header
    setAuthToken(false)
    // set the current use to an empty object which wiill set isAuth to false
    dispatch(setCurrentUser({}))
}