const errorHandaler = require("http-errors");
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    // validation
    if (!accessToken) {
      throw errorHandaler(400, "no access token found. please Login");
    }

    // verify which user login
    const decode = jwt.verify(accessToken, process.env.TOKEN_GEN_SECRET_JWT);

    if (!decode)
      throw errorHandaler(401, "invalid accesstoken. please login in again");

    req.user = decode.user;
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (accessToken) {
      throw errorHandaler(400, "you are already logged in");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw errorHandaler(
        403,
        "Forbidden. You must be an admin to access this recource"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
// export
module.exports = { isLoggedIn, isLoggedOut, isAdmin };
