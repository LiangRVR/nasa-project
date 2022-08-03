const {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");
const launchesController = {};

const { getPagination } = require("../../services/query");

launchesController.httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);

  res.status(200).json(launches);
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
    await scheduleNewLaunch(launch);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }

  return res.status(201).json(launch);
};

launchesController.httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const existLaunch = await existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(400).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({ error: "Launch not aborted" });
  }
  return res.status(200).json({ ok: true });
};

module.exports = launchesController;
