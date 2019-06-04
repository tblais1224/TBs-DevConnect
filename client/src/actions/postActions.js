import axios from "axios";

import { ADD_POST, GET_ERRORS } from "./types";

//add a post
//postData is passed into the function , dispatch is used for asynchronous request
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        parload: err.response.data
      })
    );
};
