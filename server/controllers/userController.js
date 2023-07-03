const jwt = require("jsonwebtoken");
const { createToken } = require("../helper/createToken");
const deleteImage = require("../helper/delelteImage");
const User = require("../models/User");
const { findWithId } = require("../services/findWithId");
const { successResponse, errorResponse } = require("./responseController");
const { emailWithNodeMailer } = require("../helper/sendEmail");
const errorHandaler = require("http-errors");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    // init regExp
    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    // search with name, email & cell
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { cell: { $regex: searchRegExp } },
      ],
    };

    // hide password in response
    const options = { password: 0 };

    // find data from DB
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    // validation
    if (!users) throw new Error("Can't get all users");

    // count the number of document
    const count = await User.find(filter).countDocuments();

    // send response
    res.status(200).json({
      message: "all of the users",
      users,
      pagination: {
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

// get single user with id
const getSingleUser = async (req, res) => {
  try {
    const id = req.params.id;

    // hide password
    const options = { password: 0 };

    const singleUser = await findWithId(User, id, options);

    res.status(200).json({ message: "Found the single user", singleUser });
  } catch (error) {
    console.log(error.message);
  }
};

// delete singel user by id
const deleteSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    if (user.isAdmin == true) {
      res.send(`can't delete because ${user.name} is an Admin `);
    } else {
      const deletedUser = await User.findByIdAndDelete({
        _id: id,
      });
      if (!deletedUser) res.json({ message: "can't delete user" });
    }

    res.status(200).json({ messge: "user deleted successfull", deletedUser });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

// create new user
const processRegister = async (req, res) => {
  try {
    const { name, username, email, password, cell, address, image } = req.body;

    const checkMail = await User.exists({ email });
    if (checkMail) {
      return successResponse(res, {
        message: "email alreday exists",
      });
    }

    const token = createToken(
      { name, username, email, password, cell, address, image },
      "10m"
    );

    const clientURL = process.env.CLIENT_URL;

    const emailData = {
      email,
      subject: "Account activation email",
      html: `
      <h2>Hello ${name} !</h2>
      <p>Please <a href="${clientURL}/user/activate/${token}" target="_blank">click here</a> to activate your account </p>`,
    };

    // await emailWithNodeMailer(emailData);

    // send res
    return successResponse(res, {
      message: `user registration in a process. please check ${email} to verify your account`,
      payload: {
        token,
      },
    });
  } catch (error) {
    console.log("error from processRegister :", error.message);
  }
};

// activated registrated users
const activateRegisteredUser = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || token === "") {
      console.log("token not found");
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      console.log("unable to decode data from token verify");
    }

    const checkMail = await User.exists({ email: decode.email });
    if (checkMail) {
      return successResponse(res, {
        message: "This email alreday exists. please login",
      });
    }

    const activateUser = await User.create(decode);

    // send res
    return successResponse(res, {
      message: "user registration successfull",
      payload: { activateUser },
    });
  } catch (error) {
    console.log("error from activate Registered User :", error.message);
  }
};

// module exports
module.exports = {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
};
