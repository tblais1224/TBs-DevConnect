const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  //if its not empty return name if not set to empty string to test in validator
  data.text = !isEmpty(data.text) ? data.text : "";
 
  //checks if post is between 10 and 600 characters long
  if (!validator.isLength(data.text, {min: 10, max: 600})) {
    errors.text = "Post must be between 10 and 600 characters!";
  }

  //checks if the post is empty
  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
