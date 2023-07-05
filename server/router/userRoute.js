const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
} = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFile");
const { validateUserRegistration } = require("../validators/auth");
const { runValidator } = require("../validators/index");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", getAllUsers);
userRoute.post(
  "/process-register",
  upload,
  validateUserRegistration,
  runValidator,
  processRegister
);
userRoute.post("/verify", activateRegisteredUser);
userRoute.get("/:id", getSingleUser);
userRoute.delete("/:id", deleteSingleUser);

// export router
module.exports = userRoute;
