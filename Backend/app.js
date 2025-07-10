const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const errorMiddleware = require("./middleware/error");
const connectDB = require("./databaseConnection/dbConnection");
const { createCronOpetion } = require("./controllers/task");
const app = express()
require('dotenv').config();

connectDB();

app.use(express.json());
const corsOptions = {
  origin: process.env.BASE_URL_FRONTEND,
  // credentials: true, //access-control-allow-credentials:true
  // optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


cron.schedule('*/5 * * * *', async () => {
  createCronOpetion()
});



app.use("/api/v1/tasks", require("./routes/task"));


app.use(errorMiddleware);

const server = app.listen(process.env.PORT || 4500, function () {
  console.log("Server Started on Port ", process.env.PORT);
});
