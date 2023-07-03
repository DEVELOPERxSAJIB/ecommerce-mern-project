const multer = require("multer");
const path = require("path");
const { allowed_file_type, max_file_size } = require("../secret");
const createHttpError = require("http-errors");

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
    return cb(createHttpError(400, "This file type not supported"));
  }
  return cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {fileSize: max_file_size},
  fileFilter,
}).single("image");

module.exports = { upload };
