const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// (?=.*[a-z]) - The password must contain at least 1 lowercase alphabetical character
// (?=.*[A-Z]) - The password must contain at least 1 uppercase alphabetical character
// (?=.*[0-9]) - The password must contain at least 1 numeric character
// (?=.*[!@#$%^&*])	The password must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
// (?=.{8,}) - The password must be eight characters or longer
const strongPasswordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
const minNameLength = 3;

exports.IsEmailValid = (email) => email && emailRegexp.test(email);

exports.IsPasswordValid = (password) =>
  password && strongPasswordRegexp.test(password);

exports.IsFirstnameValid = (firstname) =>
  firstname && firstname.trim().length >= minNameLength;

exports.IsLastnameValid = (lastname) =>
  lastname && lastname.trim().length >= minNameLength;
