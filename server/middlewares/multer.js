const multer = require("multer");
const { allowed_file_type, max_file_size } = require("../secret");

// create storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  
    if(!file.mimetype.startsWith("image/")) {
        return cb(new Error("only image files are allowed"), false)
    }

    if(file.size > max_file_size) {
        return cb(new Error("this file is too large"), false)
    }

    if(!allowed_file_type.includes(file.mimetype)) {
        return cb(new Error("this file type is not allowed"), false)
    }

    cb(null, true)

};

const uploadImage = multer({
  storage: storage,
  fileFilter : fileFilter,
}).single("image");

module.exports = { uploadImage };
