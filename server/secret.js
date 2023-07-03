require("dotenv").config();
const userName = process.env.SMTP_USERNAME;
const userPass = process.env.SMTP_PASSWORD;

const max_file_size = Number(process.env.MAX_FILE_SIZE);
const allowed_file_type = process.env.ALLOWED_FILE_TYPE;
module.exports = { userName, userPass, max_file_size, allowed_file_type };
