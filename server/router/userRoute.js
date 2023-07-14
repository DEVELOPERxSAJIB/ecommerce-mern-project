const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
  updateUserById,
  banUserById,
  unbanUserById,
  updateUserPassword,
  passwordForgot,
  resetUserPassword,
} = require("../controllers/userController");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateEmailForForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const { runValidator } = require("../validators/index");
const { uploadImage } = require("../middlewares/multer");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

// init router
const userRoute = express.Router();

// user routes
userRoute.post(
  "/process-register",
  isLoggedOut,
  uploadImage,
  validateUserRegistration,
  runValidator,
  processRegister
);
userRoute.post(
  "/forget-password",
  validateEmailForForgetPassword,
  passwordForgot
);
userRoute.put(
  "/reset-password",
  validateUserResetPassword,
  runValidator,
  resetUserPassword
);

userRoute.get("/", isLoggedIn, isAdmin, getAllUsers);
userRoute.post("/verify", isLoggedOut, activateRegisteredUser);
userRoute.get("/:id", isLoggedIn, isAdmin, getSingleUser);
userRoute.delete("/:id", isLoggedIn, isAdmin, deleteSingleUser);
userRoute.put("/:id", isLoggedIn, uploadImage, updateUserById);
userRoute.put("/ban-user/:id", isLoggedIn, isAdmin, banUserById);
userRoute.put("/unban-user/:id", isLoggedIn, isAdmin, unbanUserById);
userRoute.put(
  "/update-password/:id",
  isLoggedIn,
  validateUserPasswordUpdate,
  runValidator,
  updateUserPassword
);

// export router
module.exports = userRoute;
