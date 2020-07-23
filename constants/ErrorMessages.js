const USER_EXISTS = {
  id: 1,
  message: "User already exists",
};

const INVALID_PARAM = {
  id: 2,
  message: "One of the request parameters is not valid",
};

const EMAIL_PASSWORD_WRONG = {
  id: 3,
  message: "Either email or password is wrong",
};

const AUTH_FAILED = {
  id: 4,
  message: "Authentication failed",
};

const INVALID_TOKEN = {
  id: 5,
  message: "Invalid Token",
};

const USE_SECURE_PASSWORD = {
  id: 6,
  message: "Please use a more secure password",
};

const LOGIN_FAIL_LIMIT_REACHED = {
  id: 7,
  message: "Cannot login due to multiple failed login attempts",
};

const UNEXPECTED_ERROR = {
  id: 999,
  message: "An unexpected error happened",
};

module.exports = {
  USER_EXISTS,
  INVALID_PARAM,
  EMAIL_PASSWORD_WRONG,
  AUTH_FAILED,
  INVALID_TOKEN,
  USE_SECURE_PASSWORD,
  LOGIN_FAIL_LIMIT_REACHED,

  UNEXPECTED_ERROR,
};
