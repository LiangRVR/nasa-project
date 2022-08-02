const express = require("express");
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const apiV1Router = express.Router();

apiV1Router.use("/planets", planetsRouter);
apiV1Router.use("/launches", launchesRouter);

module.exports = apiV1Router;
