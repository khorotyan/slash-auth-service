const bcrypt = require("bcryptjs");

const usersRepo = require("../repositories/usersRepo");
const loginFailRepo = require("../repositories/loginFailRepo");
const User = require("../models/user");
const LoginFail = require("../models/loginFail");
const jwtHandler = require("../middleware/jwtHandler");
const {
  IsFirstnameValid,
  IsLastnameValid,
  IsEmailValid,
  IsPasswordValid,
} = require("../utils/paramValidator");
const {
  USER_EXISTS,
  INVALID_PARAM,
  EMAIL_PASSWORD_WRONG,
  AUTH_FAILED,
  USE_SECURE_PASSWORD,
  LOGIN_FAIL_LIMIT_REACHED,
  UNEXPECTED_ERROR,
} = require("../constants/ErrorMessages");

const bcryptSaltLength = 12;
const maxLoginFails = 3;

exports.signupUser = async (req, res, next) => {
  try {
    const { firstname, lastname, password } = req.body;
    let email = req.body.email;

    // Check validity of parameters
    if (
      !IsFirstnameValid(firstname) ||
      !IsLastnameValid(lastname) ||
      !IsEmailValid(email)
    ) {
      return res.status(400).json(INVALID_PARAM);
    } else if (!IsPasswordValid(password)) {
      return res.status(400).json(USE_SECURE_PASSWORD);
    }

    email = email.toLowerCase();

    // Check if the user exists
    const dbUser = await usersRepo.findUserByEmail(email);

    if (dbUser) {
      return res.status(400).json(USER_EXISTS);
    }

    const hashedPassword = await encryptPassword(password);

    if (!hashedPassword) {
      return res.status(400).json(UNEXPECTED_ERROR);
    }

    // Save user
    const user = new User({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email,
      password: hashedPassword,
    });

    await usersRepo.createUser(user);

    // Generate jwt token
    const accessToken = jwtHandler.generateAccessToken(user._id);
    const refreshToken = jwtHandler.generateRefreshToken(user._id);

    return res.status(200).json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signinUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    const password = req.body.password;

    email = email ? email.toLowerCase() : email;

    // Get user from the db and verify user email and password
    const dbUser = await usersRepo.findUserByEmail(email);

    if (!dbUser) {
      return res.status(400).json(EMAIL_PASSWORD_WRONG);
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);

    const loginFailsCount = await loginFailRepo.findLoginFailsCount(email);

    if (loginFailsCount >= maxLoginFails) {
      return res.status(400).json(LOGIN_FAIL_LIMIT_REACHED);
    }

    if (!isMatch) {
      const loginFail = new LoginFail({
        email: email,
      });
      await loginFailRepo.createLoginFail(loginFail);

      return res.status(400).json(EMAIL_PASSWORD_WRONG);
    }

    // Generate jwt token
    const accessToken = jwtHandler.generateAccessToken(dbUser._id);
    const refreshToken = jwtHandler.generateRefreshToken(dbUser._id);

    return res.status(200).json({
      user: {
        _id: dbUser._id,
        firstname: dbUser.firstname,
        lastname: dbUser.lastname,
        email: dbUser.email,
      },
      token: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const email = req.body.email;
    const refreshToken = req.body.refreshToken;

    let tokenData;

    // Verify refresh token
    try {
      tokenData = jwtHandler.verifyToken(refreshToken);
    } catch (error) {
      return res.status(401).json(AUTH_FAILED);
    }

    // Verify that the token belongs to the user
    const dbUser = await usersRepo.findUserByEmail(email);

    if (!dbUser || dbUser._id.toString() !== tokenData.userId) {
      return res.status(401).json(AUTH_FAILED);
    }

    // Generate new access token
    const accessToken = jwtHandler.generateAccessToken(tokenData.userId);
    const newRefreshToken = jwtHandler.generateRefreshToken(tokenData.userId);

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(bcryptSaltLength);

  if (salt) {
    return await bcrypt.hash(password, salt);
  }

  return null;
};
