const errorHandaler = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { successResponse } = require("./responseController");

// user login
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // check email exists
    const user = await User.findOne({ email });
    if (!user) {
      throw errorHandaler("This email does't exists. please sing up");
    }

    // match password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch === false) {
      throw errorHandaler("wrong password");
    }

    // check ban user
    if (user.isBanned === true) {
      throw errorHandaler("You are banned. Please contact to the support team");
    }

    // genarate access token after login
    const accessToken = jwt.sign({ user }, process.env.TOKEN_GEN_SECRET_JWT, {
      expiresIn: "5m",
    });

    // set token to cookie memory
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 5, // 5 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    // genarate refresh token
    const refreshToken = jwt.sign(
      { user },
      process.env.FREFRESH_TOKEN_GEN_JWT,
      {
        expiresIn: "30d",
      }
    );

    // store refresh token to cookie memory
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "none",
    });

    // don't return password
    const userWithOutPassword = user.toObject();
    delete userWithOutPassword.password

    // send data to response
    successResponse(res, {
      statusCode: 200,
      message: "user login successfull",
      payload: {
        userWithOutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// user logout
const userLogout = (req, res, next) => {
  // clear cookie
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  // send res
  successResponse(res, {
    statusCode: 200,
    message: "user log Out successfull",
  });
};

// genarate refresh token
const userRegTokenGen = (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      throw errorHandaler(404, "refresh token not found. please login");
    }

    const decodedToken = jwt.verify(
      oldRefreshToken,
      process.env.FREFRESH_TOKEN_GEN_JWT
    );

    if (!decodedToken) {
      throw errorHandaler(404, "refresh token is not verifyed");
    }

    // genarate access token for 1 mnt
    const accessToken = jwt.sign(
      decodedToken.user,
      process.env.TOKEN_GEN_SECRET_JWT,
      {
        expiresIn: "5m",
      }
    );

    // set token to cookie memory
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 5, // 5 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    // send response
    successResponse(res, {
      statusCode: 200,
      message: "accessToken refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// protected router for user
const userProtectedRoute = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw errorHandaler(
        404,
        "access token not found. please login or generate access token"
      );
    }

    // verify
    const decodedToken = jwt.verify(
      accessToken,
      process.env.TOKEN_GEN_SECRET_JWT
    );

    if (!decodedToken) {
      throw errorHandaler(404, "Invalid access token. please login");
    }

    // send res
    successResponse(res, {
      statusCode: 200,
      message: "protected resourse accessed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// module exports
module.exports = { userLogin, userLogout, userRegTokenGen, userProtectedRoute };
