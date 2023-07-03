const jwt = require("jsonwebtoken");

// create json web token
const createToken = (payload, expiresIn) => {
  try {
    if (payload === 'object' || !payload) {
      throw new Error("payload must be a non-empty object");
    }

    if (
      process.env.JWT_SECRET === "string" ||
      process.env.JWT_SECRET === ""
    ) {
      throw new Error("SecretKey must be a non-empty string");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn,
    });

    return token;

  } catch (error) {
    console.error( `Faild to sing at JSON Web Token :`, error.message);
  }
};

module.exports = { createToken };
