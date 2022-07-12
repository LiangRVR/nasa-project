const express = require("express")
const launchesController = require("./launches.controller")

const launchesRouter = express.Router();

launchesRouter.get('/launches', launchesController.httpGetAllLaunches)

module.exports= launchesRouter
