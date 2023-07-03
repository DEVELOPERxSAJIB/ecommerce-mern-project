const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
} = require("../controllers/userController");
const { upload } = require("../middlewares/uploadFile");

// init router
const userRoute = express.Router();

// user routes
userRoute.get("/", getAllUsers);
userRoute.post("/process-register", upload, processRegister);
userRoute.post("/verify", activateRegisteredUser);
userRoute.get("/:id", getSingleUser);
userRoute.delete("/:id", deleteSingleUser);

// export router
module.exports = userRoute;
