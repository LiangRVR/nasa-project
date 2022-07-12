const planetsModel = require("../../models/planets.model");
const planetController = {};

planetController.httpGetAllPlanets = (req, res) => {
  return res.status(200).json(planetsModel.getAllPlanets());
};

module.exports = planetController;
