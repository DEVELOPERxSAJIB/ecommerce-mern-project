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
      expiresIn: "15m",
    });

   
    // set token to cookie memory
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 15, //15 min
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    const userWithOutPassword = await User.findOne({ email }).select("-password")

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

  // send res
  successResponse(res, {
    statusCode: 200,
    message: "user log Out successfull",
  });
};

// module exports
module.exports = { userLogin, userLogout };
