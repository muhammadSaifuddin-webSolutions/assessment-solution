const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // console.log(err.errors);
  if (err.name === "CastError") {
    const message = `Resource not Found . Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose Dublicate key error
  if (err.code === 11000) {
    const message = `Dublicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }


  res.status(err.statusCode).json({
    success: false,
    error: err.stack,
    message: err.message,
    error: err.stack
  });
};
