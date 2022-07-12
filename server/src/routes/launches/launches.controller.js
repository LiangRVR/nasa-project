const launchesModel = require("../../models/launches.model");
const launchesController = {};

launchesController.httpGetAllLaunches = (req, res) => {
  res.status(200).json(launchesModel.getAllLaunches());
};

module.exports = launchesController;
