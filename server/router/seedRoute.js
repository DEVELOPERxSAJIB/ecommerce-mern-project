const { seedUsers } = require("../controllers/seedController");

// init express
const express = require("express");

// init router from express
const seedRouter = express.Router();

// routes
seedRouter.get("/users", seedUsers);

// export router
module.exports = seedRouter;
