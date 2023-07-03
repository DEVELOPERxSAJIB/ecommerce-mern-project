const multer = require("multer");
const path = require("path");
const { allowed_file_type } = require("../secret");
const { errorResponse } = require("../controllers/responseController");

// create storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);

  if (!allowed_file_type.includes(extname.substring(1))) {
    console.log("This file type not supported");
  }
  return cb(null, true);
};

const upload = multer({ storage: storage, fileFilter }).single("image");

module.exports = { upload };
