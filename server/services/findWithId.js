const mongoose = require("mongoose");
const User = require("../models/User");

const findWithId = async (id, options) => {
  try {
    

    // find user by id
    const item = await User.findById(id, options);

    // validator
    if (!item) throw new Error("can't find singel item with id");

    return item;
    
  } catch (error) {
    // specifically for mongoose error
    if (error instanceof mongoose.Error) {
      throw new Error("Invalid user Id");
    }
  }
};

// export find user
module.exports = { findWithId };
