const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //if its not empty return name if not set to empty string to test in validator
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title is required!";
  }
  if (validator.isEmpty(data.company)) {
    errors.company = "You must add a company!";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
