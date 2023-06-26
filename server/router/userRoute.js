const express = require("express");
const { getAllUsers } = require("../controllers/userController");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", getAllUsers);

// export router
module.exports = userRoute;
