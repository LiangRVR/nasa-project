const { launches } = require("../../models/launches.model");
const launchesController = {};

launchesController.getAllLaunches = (req, res) => {
  res.status(200).json(Array.from(launches.values()));
};

module.exports = launchesController;
