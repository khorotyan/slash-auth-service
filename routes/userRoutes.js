const express = require("express");

const usersLogic = require("../businessLayer/usersLogic");
const { authorize } = require("../middleware/jwtHandler");

const router = express.Router();

/// Authentication ///

// SignUp a user
// POST: /users/signup
router.post("/signup", usersLogic.signupUser);

// SignIn a user
// POST: /users/signin
router.post("/signin", usersLogic.signinUser);

// Refresh access token
// POST: /users/refresh-token
router.post("/refresh-token", usersLogic.refreshToken);

module.exports = router;
