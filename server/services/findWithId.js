const mongoose = require("mongoose");

const findWithId = async (Modal, id, options) => {
  try {
    // find user by id
    const item = await Modal.findById(id, options);

    // validator
    if (!item) throw new Error(`can't find ${Modal.modalName} with this id`);

    return item;
  } catch (error) {
    // specifically for mongoose error
    if (error instanceof mongoose.Error) {
      throw new Error("Invalid items Id");
    }
  }
};

// export find user
module.exports = { findWithId };
