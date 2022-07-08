const planetsModel = require("../../models/planets.model")
const planetController = {};

planetController.getAllPlanets = (req, res) => {
  return res.status(200).json(planetsModel);
};

module.exports = planetController;
