// error handaler
const errorResponse = (
  res,
  { statusCode = 500, message = "error from response Controller" }
) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

// success response
const successResponse = (
  res,
  { statusCode = 200, message = "success", payload = {} }
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    payload,
  });
};

module.exports = { errorResponse, successResponse };
