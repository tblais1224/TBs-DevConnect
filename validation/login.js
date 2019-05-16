const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  //if its not empty return name if not set to empty string to test in validator
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  
  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid!";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required!";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required!";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
