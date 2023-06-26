const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// create Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
      trim: true,
      minlength: [4, "username can't be less then 4 carrectar"],
      maxlength: [16, "username can't be more then 16 carrectar"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v);
        },
        message: "please, enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [4, "password can't be less then 4 carrectar"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: process.env.DEFAULT_IMG,
    },
    cell: {
      type: String,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// export schema model
module.exports = mongoose.model("User", userSchema);
