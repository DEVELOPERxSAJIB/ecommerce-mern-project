const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const errorHandaler = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const seedingRouter = require("./router/seedRoute");
const userRouter = require("./router/userRoute");
const authRouter = require("./router/authRoute");
const mongoDBConnection = require("./config/configDB");
const { errorResponse } = require("./controllers/responseController");

// config env
require("dotenv").config();

// init express
const app = express();

// request on console
app.use(morgan("dev"));
app.use(cookieParser())

// secure API
const reteLimiter = rateLimit({
  windowMs: 1000 * 60,
  max: 15,
  message: "To many request from this API. Please try again after some time",
});
app.use(reteLimiter);
app.use(xssClean());

// init json data into express (middlewares)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/seed", seedingRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

// error handaling middlewares
app.use((req, res, next) => {
  next(errorHandaler(404, "Routes Not found"));
});

// server error handaling -> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

// environment varibale
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`.bgGreen.black);
  mongoDBConnection();
});
