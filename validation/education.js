const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  //if its not empty return name if not set to empty string to test in validator
  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.school)) {
    errors.school = "A school is required!";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Must enter a degree!";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Must enter a field of study!";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "From date field is required!";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
