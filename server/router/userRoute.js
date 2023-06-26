const express = require("express");
const { getAllUsers, getSingleUser } = require("../controllers/userController");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", getAllUsers);
userRoute.get("/:id", getSingleUser)

// export router
module.exports = userRoute;
