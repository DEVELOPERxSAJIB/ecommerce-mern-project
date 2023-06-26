const User = require("../models/User");
const { findWithId } = require("../services/findWithId");

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

    const singleUser = await findWithId(id, options);

    res.status(200).json({ message: "Found the single user", singleUser });
  } catch (error) {
    console.log(error.message);
  }
};

// module exports
module.exports = { getAllUsers, getSingleUser };
