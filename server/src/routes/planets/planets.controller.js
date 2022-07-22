const planetsModel = require("../../models/planets.model");
const planetController = {};

planetController.httpGetAllPlanets = async (req, res) => {
  return res.status(200).json(await planetsModel.getAllPlanets());
};

module.exports = planetController;
