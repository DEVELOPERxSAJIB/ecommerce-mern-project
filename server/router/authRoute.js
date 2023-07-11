const express = require("express");
const { userLogin, userLogout } = require("../controllers/authController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");
const { runValidator } = require("../validators");


// init router
const authRoute = express.Router();

// user routes
authRoute.post("/login", validateUserLogin, runValidator, isLoggedOut, userLogin);
authRoute.post("/logout", isLoggedIn, userLogout);

// export router
module.exports = authRoute;
