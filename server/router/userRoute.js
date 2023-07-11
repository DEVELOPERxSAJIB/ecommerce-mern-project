const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
  updateUserById,
  banUserById,
  unbanUserById
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/auth");
const { runValidator } = require("../validators/index");
const { uploadImage } = require("../middlewares/multer");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", isLoggedIn, isAdmin, getAllUsers);
userRoute.post(
  "/process-register",
  isLoggedOut,
  uploadImage,
  validateUserRegistration,
  runValidator,
  processRegister
);
userRoute.post("/verify", isLoggedOut, activateRegisteredUser);
userRoute.get("/:id", isLoggedIn, isAdmin, getSingleUser);
userRoute.delete("/:id", isLoggedIn, isAdmin, deleteSingleUser);
userRoute.put("/:id", isLoggedIn, uploadImage, updateUserById);
userRoute.put("/ban-user/:id", isLoggedIn, isAdmin, banUserById);
userRoute.put("/unban-user/:id", isLoggedIn, isAdmin, unbanUserById);

// export router
module.exports = userRoute;
