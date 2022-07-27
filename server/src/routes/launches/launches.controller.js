const launchesModel = require("../../models/launches.model");
const launchesController = {};

launchesController.httpGetAllLaunches = async (req, res) => {
  res.status(200).json(await launchesModel.getAllLaunches());
};

launchesController.httpAddNewLaunch = async (req, res) => {
  const launch = { ...req.body, launchDate: new Date(req.body.launchDate) };

  if (
    !launch.mission ||
    !launch.target ||
    !launch.rocket ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  try {
    await launchesModel.scheduleNewLaunch(launch);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(201).json(launch);
};

launchesController.httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const existLaunch = await launchesModel.existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }

  const aborted = await launchesModel.abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({ error: "Launch not aborted" });
  }
  return res.status(200).json({ ok: true });
};

module.exports = launchesController;
