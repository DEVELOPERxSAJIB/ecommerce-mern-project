const data = require("../config/jsonDB");
const User = require("../models/User");

// get all seed users
const seedUsers = async (req, res, next) => {
  try {

    // delete all users
    const deletedData = await User.deleteMany({});

    const users = await User.insertMany(data.users);

    // res return
    return res.status(201).json({users, deletedData})

  } catch (error) {
   console.log(error.message);
  }
};

// export controllers
module.exports = {
  seedUsers,
};
