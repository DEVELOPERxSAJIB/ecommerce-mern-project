const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
  updateUserById,
} = require("../controllers/userController");
const { validateUserRegistration } = require("../validators/auth");
const { runValidator } = require("../validators/index");
const { uploadImage } = require("../middlewares/multer");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", getAllUsers);
userRoute.post(
  "/process-register",
  uploadImage,
  validateUserRegistration,
  runValidator,
  processRegister
);
userRoute.post("/verify", activateRegisteredUser);
userRoute.get("/:id", getSingleUser);
userRoute.delete("/:id", deleteSingleUser);
userRoute.put("/:id", uploadImage, updateUserById);

// export router
module.exports = userRoute;
