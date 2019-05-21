import { GET_ERRORS } from "./types";

import axios from "axios";

//Register User
export const registerUser = userData => dispatch => {
  // sends post to the proxy plus route below
  axios
    .post("/api/users/register", userData)
    .then(res => console.log(res.data))
    //console logs the data from the error response
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
