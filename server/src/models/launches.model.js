const launchesDataBase = require("./launches.schema");
const planets = require("./planets.schema");
const launchesModel = {};
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

const getLatestFlightNumber = async() => {
  const latestLaunch = await launchesDataBase.findOne().sort("-flightNumber");
  console.log("pass", latestLaunch)
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

launchesModel.getAllLaunches = async () => {
  return await launchesDataBase.find({}, { _id: 0, __v: 0 });
};

launchesModel.saveLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  try {
    await launchesDataBase.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (error) {
    throw new Error(`launches do not added ${error}`);
  }
};

launchesModel.saveLaunch(launch);

launchesModel.scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customer: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });
    await launchesModel.saveLaunch(newLaunch);
};

launchesModel.existLaunchWithId = (id) => {
  return launches.has(id);
};

launchesModel.abortLaunchById = (id) => {
  const aborted = launches.get(id);
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;
};

module.exports = launchesModel;
