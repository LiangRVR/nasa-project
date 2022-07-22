require("dotenv").config();
const http = require("node:http");
const mongoose = require("mongoose");
const { loadPlanets } = require("./models/planets.model");
const app = require("./app");

const PORT = process.env.PORT || 8000;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const server = http.createServer(app);

const MONGO_URL = `mongodb+srv://${dbUsername}:${dbPassword}@nasa-db.zklge.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

const startServer = async () => {
  await mongoose.connect(MONGO_URL);
  try {
    await loadPlanets();
    server.listen(PORT, () => {
      console.log(`Listening on Port ${PORT} 🖥 `);
    });
  } catch (error) {
    console.log("Server did not started", { error });
  }
};

startServer();
