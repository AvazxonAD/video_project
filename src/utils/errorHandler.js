const { json } = require("body-parser");
const { log } = require("console");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err.stack);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "internal server error",
  });
};

module.exports = errorHandler;