const jwt = require("jsonwebtoken");
const { INVALID_TOKEN, AUTH_FAILED } = require("../constants/ErrorMessages");

const accessTokenExpireTime = "1h";
const refreshTokenExpireTime = "14d";

exports.generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: accessTokenExpireTime,
  });

exports.generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: refreshTokenExpireTime,
  });

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

// If a request were to need to authorize, we would need to use this (e.g. UpdateProfile)
exports.authorize = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);

      if (!tokenData.userId) {
        return res.status(401).json(AUTH_FAILED);
      }

      req.middleware = {
        userId: tokenData.userId,
      };
      next();
    } catch (error) {
      return res.status(401).json(INVALID_TOKEN);
    }
  } else {
    return res.status(401).json(AUTH_FAILED);
  }
};

// Authorized actions need to have access to the user to know who is doing the actions
exports.extractUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];

    try {
      const tokenData = jwt.verify(token, process.env.JWT_SECRET);

      if (!tokenData.userId) {
        next();
      }

      req.middleware = {
        userId: tokenData.userId,
      };

      next();
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};
