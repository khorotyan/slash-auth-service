const User = require("../models/user");

exports.findUserByEmail = (email) => User.findOne({ email: email });

exports.findUserById = (id) => User.findById(id);

exports.getUserProfile = (id) => User.findById(id).select("firstname lastname");

exports.createUser = (user) => user.save();
