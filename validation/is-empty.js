//in ES6 you can refactor an arrow function like this. no return needed
const isEmpty = value =>
  value === undefined ||
  value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty