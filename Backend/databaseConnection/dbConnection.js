const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB");
  } catch (error) {
    console.log("Error connection to DB ", error);
  }
};
module.exports = connectDB;
