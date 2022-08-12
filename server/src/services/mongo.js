require("dotenv").config();
const mongoose = require("mongoose");
const mongoService = {};

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

mongoService.mongoConnect = async () => {
  await mongoose.connect(MONGO_URL);
};

mongoService.mongoDisconnect = async () => {
  await mongoose.disconnect();
  console.log("mongodb is disconnected")
};

module.exports = mongoService;
