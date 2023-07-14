const { body } = require("express-validator");

// registration validator for feilds
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name feilds are required")
    .isLength({ min: 3, max: 32 })
    .withMessage("name should be at least 3-32 characters"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("username should be at least 3-32 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("address is required")
    .isLength({ min: 4 })
    .withMessage("addresss should at least 6 characters long"),
  body("image")
    .trim()
    .optional()
    .isString()
    .withMessage("uploading image is your choise"),
];

// user login validaton
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
];

// user update Password validaton
const validateUserPasswordUpdate = [
  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("old password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("confirm password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
];

// user password forgot validaton for entered email
const validateEmailForForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email address required")
    .isEmail()
    .withMessage("Invalid email address"),
];

// user password reset validaton
const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("token is required"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("confirm password is required")
    .isLength({ min: 6 })
    .withMessage("password should at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/
    )
    .withMessage(
      "password should at least 6 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
];

// export validator
module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateEmailForForgetPassword,
  validateUserResetPassword,
};
