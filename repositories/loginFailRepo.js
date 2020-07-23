const LoginFail = require("../models/loginFail");

exports.findLoginFailsCount = (email) =>
  LoginFail.countDocuments({ email: email });

exports.createLoginFail = (loginFail) => loginFail.save();
