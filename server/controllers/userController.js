const jwt = require("jsonwebtoken");
const { createToken } = require("../helper/createToken");
const deleteImage = require("../helper/delelteImage");
const User = require("../models/User");
const { findWithId } = require("../services/findWithId");
const { successResponse, errorResponse } = require("./responseController");
const { emailWithNodeMailer } = require("../helper/sendEmail");
const errorHandaler = require("http-errors");
const bcrypt = require("bcryptjs");

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
      return res.send(`can't delete because ${user.name} is an Admin `);
    } else {
      const deletedUser = await User.findByIdAndDelete({
        _id: id,
      });
      if (!deletedUser) return res.json({ message: "can't delete user" });
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
    const { name, username, email, password, cell, address } = req.body;

    const image = req.file;

    if (!image) {
      return errorResponse(res, {
        statusCode: 400,
        message: "no file found to upload",
      });
    }

    if (image.size > 1024 * 1024 * 2) {
      return errorResponse(res, {
        statusCode: 400,
        message: "File is to large",
      });
    }

    const imageBufferString = image.buffer.toString("base64");

    const checkMail = await User.exists({ email });
    if (checkMail) {
      return successResponse(res, {
        message: "email alreday exists",
      });
    }

    const token = createToken(
      {
        name,
        username,
        email,
        password,
        cell,
        address,
      },
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
        imgBuffer: imageBufferString,
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
    successResponse(res, {
      message: "user registration successfull",
      payload: { activateUser },
    });
  } catch (error) {
    console.log("error from activate Registered User :", error.message);
  }
};

// update user by id
const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await findWithId(User, id, options);

    const userOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.username) {
      updates.username = req.body.username;
    }
    if (req.body.password) {
      updates.password = req.body.password;
    }
    if (req.body.name) {
      updates.name = req.body.name;
    }
    if (req.body.address) {
      updates.address = req.body.address;
    }
    if (req.body.cell) {
      updates.cell = req.body.cell;
    }

    const image = req.file;

    if (image) {
      if (image.size >= 1024 * 1024 * 2) {
        return errorResponse(res, {
          statusCode: 400,
          message: "File is to large to replace",
        });
      } else {
        updates.image = image.buffer.toString("base64");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      userOptions
    ).select("-password");

    if (!updatedUser) {
      return errorResponse(res, {
        statusCode: 404,
        message: "user with this ID not found",
      });
    }

    successResponse(res, {
      statusCode: 200,
      message: "user updated successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// Ban user by id
const banUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userOptions = { new: true, runValidators: true, context: "query" };

    const updates = { isBanned: true };
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      userOptions
    ).select("-password");

    if (!updatedUser) {
      return errorResponse(res, {
        statusCode: 400,
        message: "can't ban this user",
      });
    }

    successResponse(res, {
      statusCode: 200,
      message: "user banned successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// Unban user by id
const unbanUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userOptions = { new: true, runValidators: true, context: "query" };

    const updates = { isBanned: false };
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      userOptions
    ).select("-password");

    if (!updatedUser) {
      return errorResponse(res, {
        statusCode: 400,
        message: "Can't unban user",
      });
    }

    successResponse(res, {
      statusCode: 200,
      message: "user unbanned successfully",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// update or change password
const updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const id = req.params.id;

    const user = await findWithId(User, id);

    const mtcOldPassWithNewPass = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!mtcOldPassWithNewPass) {
      throw errorHandaler(
        400,
        "old password is not match with this user profile"
      );
    }

    if (oldPassword === newPassword) {
      throw errorHandaler(
        400,
        "Can't change your correct password to your new password"
      );
    }

    if (newPassword !== confirmPassword) {
      throw errorHandaler(
        400,
        "confirmation password did't match to new password"
      );
    }

    const whoUpdatePass = await User.findByIdAndUpdate(
      id,
      {
        password: newPassword,
      },
      { new: true }
    );

    // send response
    successResponse(res, {
      statusCode: 200,
      message: "password updated successfully",
      payload: { whoUpdatePass },
    });
  } catch (error) {
    next(error);
  }
};

// forgot password
const passwordForgot = async (req, res, next) => {
  try {
    const clientURL = process.env.CLIENT_URL;

    const { email } = req.body;

    // check email if exists
    const emailCheck = await User.findOne({ email });
    if (!emailCheck)
      throw errorHandaler(404, "user doesn't exists with this email");

    // generate token
    const token = jwt.sign({ email }, process.env.TOKEN_GEN_FORGOT_PASSWORD, {
      expiresIn: 1000 * 60 * 3,
    });

    // send token to verify email
    const emailData = {
      email,
      subject: "Forgot Password",
      html: `
      <h2>Hello ${emailCheck.name} !</h2>
      <p>Please <a href="${clientURL}/user/forget-password/${token}" target="_blank">click here</a> to activate your account </p>`,
    };

    // emailWithNodeMailer(emailData);

    // send response
    successResponse(res, {
      statusCode: 200,
      message:
        "A link has been sent to your email address. please verify and reset your password",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// reset user password
const resetUserPassword = async (req, res, next) => {
  try {

    const { token, newPassword, confirmPassword } = req.body;

    const decode = jwt.verify(token, process.env.TOKEN_GEN_FORGOT_PASSWORD);

    const user = await User.findOne({ email : decode.email })

    const mtcOldPassWithNewPass = await bcrypt.compare(
      newPassword,
      user.password
    )

    if(mtcOldPassWithNewPass) throw errorHandaler(400, "you have enterd an old password. Please try agian with different key")

    if (newPassword !== confirmPassword) {
      throw errorHandaler(400, "confirm password didn't match to new password");
    }

    const id = user._id
    const resetedPass = await User.findByIdAndUpdate(id, {
      password : confirmPassword
    }, { new : true }).select("-password")

    // send response
    successResponse(res, {
      statusCode: 200,
      message: "password reset successfully",
      payload : {
        resetedPass
      }
    });
  } catch (error) {
    next(error);
  }
};



// module exports
module.exports = {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  processRegister,
  activateRegisteredUser,
  updateUserById,
  banUserById,
  unbanUserById,
  updateUserPassword,
  passwordForgot,
  resetUserPassword,
};
