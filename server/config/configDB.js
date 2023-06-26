const mongoose = require("mongoose");

// mongoDB Connection
const mongoDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB connection established`.bgWhite.bold);

  } catch (error) {
    console.log(error.message);
  }
};

// export dataBase connection
module.exports = mongoDBConnection;
