const http = require("node:http");
const { loadPlanets } = require("./models/planets.model");
const app = require("./app");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
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
