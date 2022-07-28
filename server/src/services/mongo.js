require("dotenv").config();
const mongoose = require("mongoose");
const mongoService = {};

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const MONGO_URL = `mongodb+srv://${dbUsername}:${dbPassword}@nasa-db.zklge.mongodb.net/nasa?retryWrites=true&w=majority`;

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
