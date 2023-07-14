const express = require("express");
const { userLogin, userLogout, userRegTokenGen, userProtectedRoute } = require("../controllers/authController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");
const { runValidator } = require("../validators");

// init router
const authRoute = express.Router();

// user routes
authRoute.post(
  "/login",
  validateUserLogin,
  runValidator,
  isLoggedOut,
  userLogin
);
authRoute.post("/logout", isLoggedIn, userLogout);
authRoute.get("/refresh-token", userRegTokenGen)
authRoute.get("/protected", userProtectedRoute)

// export router
module.exports = authRoute;
